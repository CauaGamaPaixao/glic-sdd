# Design

## Context

O repositório é um scaffold Vite + React 19: `src/App.jsx` apenas exibe um placeholder, `src/api/`, `src/components/` e `src/pages/` contêm apenas `.gitkeep`, `db.json` já traz as coleções `disciplinas` e `atividades` no formato do contrato, e `package.json` já possui o script `api` para subir o JSON Server 0.17 na porta 3001. Não há specs publicadas nem dependências de UI, formulário, roteamento ou estado. Ver `proposal.md` para a motivação e `specs/agenda-atividades/spec.md` para o contrato de comportamento.

## Goals / Non-Goals

**Goals:**

- Separar responsabilidades em camadas: cliente HTTP (`src/api`), componentes de apresentação (`src/components`), orquestração da tela (`src/pages`).
- Tornar o tratamento de erro de rede e HTTP uniforme em ambos os clientes de API.
- Manter a listagem sempre coerente com o que foi cadastrado, sem recarregar a página.
- Garantir que o formulário nunca dispare requisição inválida e nunca produza cadastro duplicado.

**Non-Goals:**

- Introduzir bibliotecas de terceiros ou TypeScript.
- Criar camadas de estado global, cache, roteamento ou autenticação.
- Implementar edição, exclusão, conclusão ou filtros de atividades.

## Decisions

### Base URL centralizada nos clientes HTTP

Ambos os clientes em `src/api/` usarão uma constante única `http://localhost:3001` como base, concatenada aos caminhos `/disciplinas`, `/atividades?_sort=prazo&_order=asc` e `/atividades`. O status da resposta é verificado explicitamente (`response.ok`), cobrindo inclusive respostas 3xx/4xx/5xx. Erros de `fetch` (rede) e erros HTTP serão lançados como `Error` com mensagem legível, deixando a decisão de exibição para a página.

- Alternativa considerada: chamar `fetch` diretamente nos componentes. Rejeitada porque duplicaria a base URL e o tratamento de status, dificultando a manutenção.
- Alternativa considerada: variável de ambiente `VITE_API_URL`. Rejeitada por ora; a base fixa atende ao contrato do JSON Server e evita configuração extra (ver Questão em aberto 1).

### Orquestração de estado em `AtividadesPage`

`AtividadesPage` será dona do estado da tela: lista de atividades, disciplinas e estados de carregamento/erro da listagem. Atividades e disciplinas são buscadas em paralelo (`Promise.all`); se qualquer uma falhar, a página exibe `ErroApi`, e "Tentar novamente" refaz as duas buscas. O estado do envio (valores, `enviando`, erros de campo e mensagens de sucesso/falha) pertence ao `AtividadeForm` (ver "Validação e envio do formulário"). Os componentes filhos recebem dados por props e comunicam eventos por callbacks.

Interfaces combinadas pelo grupo (para que cada integrante implemente seu arquivo de forma independente):

| Módulo | Exporta / Props |
|---|---|
| `src/api/disciplinas.js` | `listarDisciplinas(): Promise<Disciplina[]>` |
| `src/api/atividades.js` | `listarAtividades(): Promise<Atividade[]>`, `criarAtividade(dados): Promise<Atividade>` |
| `Carregando` | sem props |
| `ListaVazia` | sem props |
| `ErroApi` | `mensagem: string`, `onTentarNovamente: () => void` |
| `AtividadeItem` | `atividade: Atividade`, `nomeDisciplina?: string` |
| `AtividadeList` | `atividades: Atividade[]`, `disciplinas: Disciplina[]` |
| `AtividadeForm` | `disciplinas: Disciplina[]`, `onSalvar: (dados) => Promise<void>` (rejeita em caso de falha) |

- Alternativa considerada: Context API ou reducer global. Rejeitada: o escopo é uma única página e o estado é local.

### Estratégia para incluir a nova atividade na lista

Após o `POST` bem-sucedido, a página adicionará o objeto retornado ao estado local e reaplicará a ordenação por prazo ascendente. Isso evita um `GET` extra, mantém a resposta imediata e preserva a posição correta na listagem. Em caso de falha no `POST`, nenhuma alteração de estado é feita.

- Alternativa considerada: refazer o `GET` completo após salvar. Rejeitada por gerar uma requisição adicional e exigir um novo estado de carregamento; porém é uma opção caso o JSON Server retorne um objeto incompleto (Questão em aberto 2).

### Resolução do nome da disciplina e datas

Um mapa `disciplinaId -> nome` será construído a partir de `GET /disciplinas` e usado por `AtividadeItem` via prop. A formatação `dd/mm/aaaa` e o cálculo dos limiares de prazo usarão manipulação de strings/`Date` nativa, sem bibliotecas. Para comparar datas, o prazo `"YYYY-MM-DD"` será interpretado como data local (não UTC), evitando deslocamento de fuso. A regra "entre hoje e hoje+2 dias" é inclusiva nos dois extremos.

- Alternativa considerada: resolver o nome da disciplina com uma requisição por atividade. Rejeitada por gerar N requisições.

### Destaques e estados de UI como componentes isolados

`AtividadeList` percorre a lista e delega cada item a `AtividadeItem`, que calcula o destaque. `ErroApi`, `Carregando` e `ListaVazia` serão componentes pequenos e reutilizáveis, escolhidos pela página conforme o estado atual. A mensagem de erro de listagem incluirá o botão "Tentar novamente", que dispara o mesmo carregador inicial.

- Alternativa considerada: renderizar condicionais diretamente na página. Rejeitada para manter a página legível e os estados testáveis isoladamente.

### Validação e envio do formulário

`AtividadeForm` manterá seus próprios valores controlados e fará validação no submit: trim e comprimento de 3 a 80 no título, presença de `disciplinaId`, `tipo` e `prazo`, prazo não anterior a hoje. Mensagens aparecem abaixo de cada campo inválido e o envio é abortado se houver qualquer erro. O campo `prioridade` começa em "media" e `status` é fixo em "pendente" no payload. Durante o envio, o botão fica desabilitado. Em caso de falha, os valores permanecem intactos; em caso de sucesso, o formulário é resetado.

Fluxo de envio: o formulário monta o payload, define `enviando = true` e chama `await onSalvar(payload)`. Se a promise resolver, reseta os campos e exibe "Atividade cadastrada!"; se rejeitar, exibe "Não foi possível salvar a atividade. Tente novamente." e mantém os valores. Em ambos os casos, `enviando = false` no `finally`. A página, em `onSalvar`, chama `criarAtividade`, insere o retorno na lista reordenada e deixa o erro propagar.

Conversão de tipos: o valor de um `<select>` é sempre string, mas o contrato define `disciplinaId` como number. O formulário MUST converter com `Number(disciplinaId)` antes de enviar; caso contrário o JSON Server salvaria `"1"` e a resolução do nome da disciplina falharia. O título é enviado já com `trim()`.

- Alternativa considerada: validação nativa do navegador (`required`, `minLength`). Rejeitada como única estratégia porque o briefing exige mensagens posicionadas abaixo de cada campo e bloqueio explícito da requisição.

## Risks / Trade-offs

- [O JSON Server não estar rodando] → O `README.md` documentará `npm run api` antes de `npm run dev`, e o estado de erro com "Tentar novamente" cobre a falha.
- [Fuso horário alterar o dia do prazo] → Comparar datas como `YYYY-MM-DD` em fuso local e usar o mesmo critério na validação do formulário e nos destaques.
- [Cadastro com disciplina removida do `db.json`] → O item exibe rótulo indicativo de disciplina indisponível em vez de quebrar a lista.
- [Duplo clique no botão de salvar] → Botão desabilitado durante a requisição, com reabilitação em `finally`.
- [Base URL fixa impedir deploy em outro host] → Aceito para o escopo local; registrado como questão em aberto.

## Migration Plan

Não há dados ou comportamentos anteriores a migrar. A sequência de integração será: validar `db.json` e documentação, implementar clientes HTTP, componentes de estado, listagem, formulário, página e, por fim, substituir o placeholder em `App.jsx` e ajustar `index.css`. A verificação final será registrada em `verificacao.md` por Igor Ruy. Rollback consiste em restaurar o `App.jsx` placeholder; nenhuma mudança de esquema no `db.json` é necessária.

## Questões em aberto (resolvidas na revisão do grupo)

1. **Base URL configurável via `VITE_API_URL`?** Decisão: manter fixa em `http://localhost:3001`, numa única constante exportada em `src/api/config.js` (de responsabilidade do Lucas Lima), para facilitar uma futura troca.
2. **O `POST` do JSON Server 0.17 retorna o objeto completo?** Sim: retorna 201 com o objeto salvo, incluindo o `id` gerado. Decisão: inserir o retorno localmente, sem `GET` de reconciliação.
3. **Atividades `concluida` aparecem na listagem?** Decisão: sim, com o rótulo "Concluída" e sem destaque de prazo. O cenário foi adicionado à spec.
4. **Identidade visual dos destaques:** classes `.destaque-atrasada` (borda/rótulo `#c62828`), `.destaque-em-breve` (`#f9a825`) e `.destaque-concluida` (`#2e7d32`) em `index.css`, legíveis em tema claro e escuro.

## Revisão do grupo

Alterações feitas pelo grupo sobre o texto gerado pelo agente (etapa de planejamento):

- Corrigido o trecho sem sentido "O `-1` de `status` é verificado" para "O status da resposta é verificado".
- Definida a busca paralela de atividades e disciplinas, com erro único e "Tentar novamente" refazendo as duas.
- Movido o estado de envio da página para o `AtividadeForm` e escrita a tabela de interfaces entre os módulos, para que cada integrante trabalhe sem depender do arquivo do outro.
- Adicionada a regra de conversão `Number(disciplinaId)`, que o agente não previu (o select devolve string).
- Resolvidas as 4 questões em aberto.
