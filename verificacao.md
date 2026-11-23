# Verificação — agenda-atividades

- **Data:** 23/11/2026
- **Responsável:** Igor Ruy (tarefa 7.1)
- **Como foi verificado:**
  1. `openspec validate agenda-atividades --strict`, que passou.
  2. A skill **`openspec-verify-change`** no opencode (`opencode/big-pickle`). O relatório completo está no Anexo.
  3. Execução real no navegador, com `npm run api` (JSON Server em `:3001`) e `npm run dev`, conferindo cada cenário da spec.
  4. `npm run build` e `npm run lint`, que passaram sem erros.

## Checklist dos critérios de aceitação (execução real)

| # | Cenário da spec | Como foi testado | Resultado |
|---|---|---|---|
| 1 | Carregamento da agenda (ordem por prazo) | Página aberta com o `db.json` padrão | ✅ 20/11 → 25/11 → 05/12 |
| 2 | Item com disciplina conhecida | Conferido o texto de cada item | ✅ "Engenharia de Software", "Banco de Dados", "Front-end" |
| 3 | Item com disciplina não encontrada | Atividade temporária com `disciplinaId: 99` | ✅ "Disciplina indisponível" |
| 4 | Atividade atrasada | Prazo 20/11/2026 (hoje = 23/11) | ✅ rótulo "Atrasada" e classe `destaque-atrasada` |
| 5 | Atividade vencendo em breve | Prazos 23/11, 24/11 e 25/11 | ✅ rótulo "Vence em breve" (limites inclusivos) |
| 6 | Atividade sem destaque | Prazo 05/12/2026 | ✅ sem rótulo |
| 7 | Atividade concluída na listagem | Atividade temporária `concluida` com prazo vencido | ✅ "Concluída", sem "Atrasada" |
| 8 | Busca em andamento | Página aberta com a API desligada, e clique em "Tentar novamente" | ✅ "Carregando atividades..." |
| 9 | Nenhuma atividade cadastrada | `atividades: []` temporariamente no `db.json` | ✅ "Nenhuma atividade cadastrada" |
| 10 | API fora do ar ao listar | Servidor da API parado | ✅ mensagem + botão "Tentar novamente", formulário oculto |
| 11 | HTTP de erro ao listar | `requisitar('/rota-inexistente')` | ✅ lança `Erro HTTP 404 ...` (mesmo caminho do tratamento de erro) |
| 12 | Falha ao carregar disciplinas | Coberto pelo `Promise.all` (API parada derruba as duas buscas) | ✅ mesmo estado de erro |
| 13 | Nova tentativa de carregamento | API religada e clique em "Tentar novamente" | ✅ passa por "Carregando" e mostra a lista e o formulário |
| 14 | Campos disponíveis | Inspeção da página | ✅ título, disciplina (4 opções da API), tipo, prazo e prioridade ("Média" por padrão) |
| 15 | Título inválido | `"  ab  "` | ✅ "O título deve ter entre 3 e 80 caracteres.", 0 requisições |
| 16 | Campos obrigatórios ausentes | Formulário vazio | ✅ 4 mensagens, uma abaixo de cada campo, 0 requisições |
| 17 | Prazo anterior a hoje | 22/11/2026 | ✅ "O prazo não pode ser anterior a hoje.", 0 requisições |
| 18 | Formulário válido | Payload interceptado | ✅ `{"titulo":"Lista de exercícios de SQL","disciplinaId":2,...,"status":"pendente"}` (título com trim e `disciplinaId` numérico) |
| 19 | Cadastro confirmado | Envio válido | ✅ "Atividade cadastrada!", formulário limpo, item inserido na posição do prazo sem recarregar |
| 20 | API fora do ar ao salvar | Mesmo caminho de erro do item 21 (a promise rejeita) | ✅ |
| 21 | HTTP de erro ao salvar | POST respondendo 500 (simulado) | ✅ mensagem de falha, valores mantidos, nenhum item novo |
| 22 | Envio em andamento | Três submits no mesmo instante | ✅ botão desabilitado e **1** POST (depois da correção abaixo) |
| 23 | Fim da requisição | Depois de sucesso e de falha | ✅ botão volta a ficar habilitado |

Fora de escopo (edição, exclusão, conclusão, login, filtros): nada disso foi implementado ✅.

## Inconsistências encontradas e corrigidas

| Achado | Encontrado por | Estava na spec ou no código? | Correção |
|---|---|---|---|
| **Cadastro duplicado:** dois submits no mesmo instante geravam 2 POSTs. O código confiava só no `disabled` do botão, que só é aplicado no próximo render | Teste manual no navegador | **Código.** A spec já exigia "um novo envio não pode ser disparado" | Trava síncrona com `useRef` em `AtividadeForm.jsx` |
| Erro de rede propagava o `TypeError` nativo ("Failed to fetch") em vez de um `Error` legível | `openspec-verify-change` (sugestão) | **Código** divergente do `design.md` | `try/catch` em `src/api/config.js` |
| README sem a documentação da tarefa 1.2 | `openspec-verify-change` (crítico) | Tarefa pendente | README preenchido (Cauã) |
| A primeira versão deste arquivo, gerada pelo agente, dizia "Atendido" com base só na leitura do código, sem executar nada | `openspec-verify-change` (aviso) | Artefato | Arquivo reescrito com testes reais |
| Carregamento duplicado na página (o mesmo código no `useEffect` e em `carregarDados`) | Revisão de código | Código (qualidade) | `carregarDados` único + `tentarNovamente` |

---

## Anexo: relatório do `openspec-verify-change` (saída original do agente, antes das correções)

### Relatório de Verificação — `agenda-atividades`

Escopo: comparação entre o código implementado e `spec.md`, `design.md` e `tasks.md` da change.  
Nenhum arquivo foi editado e nenhum `git add`/`commit` foi realizado. `npm run lint` foi reexecutado e passou sem saída de erros; `npm run build` **não** foi reexecutado para não alterar `dist/` (há evidência prévia em `verificacao.md:9`).

**Abreviações:** `spec.md` = `openspec/changes/agenda-atividades/specs/agenda-atividades/spec.md`; `design.md` = `openspec/changes/agenda-atividades/design.md`; `tasks.md` = `openspec/changes/agenda-atividades/tasks.md`.

#### Sumário

| Dimensão | Status |
|---|---|
| Completude | **15/16 tarefas**; **11/11 requisitos** ADDED com implementação |
| Correção | **11/11 requisitos** mapeados; **24/24 cenários** com implementação (sem evidência de execução manual) |
| Coerência | **2 avisos** (evidência de verificação e documentação) e **1 sugestão** (mensagem de erro de rede); padrões de código OK |

Requisitos REMOVED/RENAMED: **nenhum**.

---

#### 1. Completude

### Tarefas (`tasks.md`)

| Tarefa | Status | Evidência |
|---|---|---|
| 1.1 | OK | `db.json:1-36` — `disciplinas` e `atividades` com todos os campos; prazos passado, hoje+2 e futuro |
| 1.2 | **PROBLEMA** | `README.md:1` contém apenas `# glic-sdd`; pré-requisitos, comandos e contrato dos endpoints não documentados |
| 2.0 | OK | `src/api/config.js:1-10` |
| 2.1 | OK | `src/api/disciplinas.js:1-5` |
| 2.2 | OK | `src/api/atividades.js:1-15` |
| 3.1 | OK | `src/components/Carregando.jsx:1-9` |
| 3.2 | OK | `src/components/ListaVazia.jsx:1-5` |
| 3.3 | OK | `src/components/ErroApi.jsx:1-11` |
| 4.1 | OK | `src/components/AtividadeItem.jsx:1-77`, `src/index.css:168-193` |
| 4.2 | OK | `src/components/AtividadeList.jsx:1-20` |
| 5.1 | OK | `src/components/AtividadeForm.jsx:3-9,79-86,103-174` |
| 5.2 | OK | `src/components/AtividadeForm.jsx:20-47,64-77` |
| 5.3 | OK | `src/components/AtividadeForm.jsx:52-57,90-100,176-189` |
| 6.1 | OK | `src/pages/AtividadesPage.jsx:22-49,67-80` |
| 6.2 | OK | `src/App.jsx:1-7`, `src/index.css:1-257`; lint reexecutado com sucesso, build registrado em `verificacao.md:9` |
| 7.1 | **PROBLEMA (parcial)** | `verificacao.md:12-39` cobre os 24 cenários, mas `verificacao.md:49` declara que não houve execução manual; a tarefa exige “evidência de execução” |

**CRÍTICO de completude:** a tarefa **1.2** continua `[ ]` em `tasks.md:6`. Se a omissão do README foi intencional, o artefato deveria registrá-la como ignorada/fora de escopo; enquanto estiver pendente, impediria o arquivamento.

---

#### 2. Correção — Requisitos (`spec.md`)

| # | Requisito | Status | Arquivo que implementa | Observação |
|---|---|---|---|---|
| 1 | Listagem ordenada de atividades (`spec.md:9`) | **OK** | `src/api/atividades.js:3-5`; `src/pages/AtividadesPage.jsx:10-12,23-25,76` | Usa `_sort=prazo&_order=asc` e reaplica ordenação local |
| 2 | Exibição dos dados da atividade (`spec.md:18`) | **OK** | `src/components/AtividadeList.jsx:4-15`; `src/components/AtividadeItem.jsx:48-68` | Resolve `disciplinaId → nome`; fallback em `AtividadeItem.jsx:50` |
| 3 | Destaque de prazo (`spec.md:32`) | **OK** | `src/components/AtividadeItem.jsx:6-34,70-72`; `src/index.css:168-193` | Datas locais, limiar `hoje+2` inclusivo; concluída não recebe destaque de prazo |
| 4 | Estado de carregamento (`spec.md:56`) | **OK** | `src/pages/AtividadesPage.jsx:17,36-38,58`; `src/components/Carregando.jsx:1-9` | Durante o carregamento, lista/vazio/erro não são renderizados |
| 5 | Estado vazio (`spec.md:65`) | **OK** | `src/pages/AtividadesPage.jsx:73-74`; `src/components/ListaVazia.jsx:1-5` | Mensagem exata conferida |
| 6 | Erro ao carregar atividades (`spec.md:74`) | **OK** | `src/api/config.js:3-10`; `src/pages/AtividadesPage.jsx:22-44,60-65`; `src/components/ErroApi.jsx:1-11` | `Promise.all` cobre falha de disciplinas; retry refaz ambas as buscas |
| 7 | Formulário de cadastro (`spec.md:98`) | **OK** | `src/components/AtividadeForm.jsx:3-9,103-174`; `src/pages/AtividadesPage.jsx:69` | Formulário acima da lista; `prioridade` padrão `media` |
| 8 | Validação do formulário (`spec.md:112`) | **OK** | `src/components/AtividadeForm.jsx:20-47,64-77,116-159` | trim, 3–80, campos obrigatórios e prazo ≥ hoje; bloqueia envio |
| 9 | Sucesso no cadastro (`spec.md:136`) | **OK** | `src/components/AtividadeForm.jsx:90-94`; `src/pages/AtividadesPage.jsx:46-49` | Limpa form, exibe mensagem e insere o retorno reordenado |
| 10 | Falha ao salvar atividade (`spec.md:145`) | **OK** | `src/api/config.js:6-8`; `src/components/AtividadeForm.jsx:95-96` | Mensagem exata; valores preservados porque o reset só ocorre no sucesso |
| 11 | Bloqueio contra cadastro duplicado (`spec.md:159`) | **OK** | `src/components/AtividadeForm.jsx:52,55-57,64-68,88-99,176-178` | `disabled` + trava síncrona via `useRef`; reabilitação no `finally` |

---

#### 3. Correção — Cenários (`spec.md`)

| Cenário | Status | Arquivo / trecho |
|---|---|---|
| Carregamento da agenda | OK | `src/api/atividades.js:4`; `src/pages/AtividadesPage.jsx:23-25` |
| Item com disciplina conhecida | OK | `src/components/AtividadeList.jsx:4-15`; `AtividadeItem.jsx:55-68` |
| Item com disciplina não encontrada | OK | `src/components/AtividadeItem.jsx:50` |
| Atividade atrasada | OK | `AtividadeItem.jsx:20-27`; `src/index.css:168-175` |
| Atividade vencendo em breve | OK | `AtividadeItem.jsx:29-31`; `src/index.css:177-184` |
| Atividade sem destaque | OK | `AtividadeItem.jsx:33`; `src/index.css:135-144` |
| Atividade concluída na listagem | OK | `AtividadeItem.jsx:16-18`; `src/index.css:186-193` |
| Busca em andamento | OK | `src/pages/AtividadesPage.jsx:17,58`; `Carregando.jsx:3-5` |
| Nenhuma atividade cadastrada | OK | `src/pages/AtividadesPage.jsx:73-74`; `ListaVazia.jsx:2` |
| API fora do ar ao listar | OK | `AtividadesPage.jsx:28-30,60-65`; `ErroApi.jsx:3-7` |
| HTTP de erro ao listar | OK | `src/api/config.js:6-8`; `AtividadesPage.jsx:28-30` |
| Falha ao carregar disciplinas | OK | `AtividadesPage.jsx:23,28-30,67-80` — form/lista ocultos no erro |
| Nova tentativa de carregamento | OK | `AtividadesPage.jsx:40-44,61-64`; `ErroApi.jsx:5-6` — ver aviso documental abaixo |
| Campos disponíveis | OK | `AtividadeForm.jsx:107-174`; `AtividadesPage.jsx:69` |
| Valores de tipo e prioridade | OK | `AtividadeForm.jsx:141-146,164-173,79-86` |
| Título inválido | OK | `AtividadeForm.jsx:22-25,75-77,116` |
| Campos obrigatórios ausentes | OK | `AtividadeForm.jsx:28-37,75-77,134-136,147,159` |
| Prazo anterior a hoje | OK | `AtividadeForm.jsx:11-18,39-43,159` |
| Formulário válido | OK | `AtividadeForm.jsx:79-91`; `src/api/atividades.js:7-15` |
| Cadastro confirmado | OK | `AtividadeForm.jsx:91-94`; `AtividadesPage.jsx:47-48` |
| API fora do ar ao salvar | OK | `AtividadeForm.jsx:95-96`; `AtividadesPage.jsx:46-49` |
| HTTP de erro ao salvar | OK | `src/api/config.js:6-8`; `AtividadeForm.jsx:95-96` |
| Envio em andamento | OK | `AtividadeForm.jsx:52,55-57,64-68,88-89,176` |
| Fim da requisição | OK | `AtividadeForm.jsx:97-100,176` |

Nenhum cenário deixou de ter condição implementada em código.

---

#### 4. Coerência

### Design Adherence (`design.md`)

- OK — base centralizada em `src/api/config.js:1` e clientes em `src/api/*.js` (`design.md:24-29`).
- OK — `Promise.all` e estado de erro único (`design.md:31-34`; `AtividadesPage.jsx:22-33`).
- OK — interfaces da tabela `design.md:37-46` correspondem às props/exportações reais.
- OK — inserção local do retorno do POST com reordenação (`design.md:50-54`; `AtividadesPage.jsx:46-49`).
- OK — datas locais e limiar inclusivo (`design.md:56-60`; `AtividadeItem.jsx:6-34`).
- OK — `Number(disciplinaId)` e `status: "pendente"` (`design.md:70-76`; `AtividadeForm.jsx:79-86`).
- OK — classes `.destaque-atrasada`, `.destaque-em-breve` e `.destaque-concluida` com as cores definidas (`design.md:95`; `src/index.css:168-193`).
- Divergência menor — `design.md:26` prevê erros de `fetch` lançados “como `Error` com mensagem legível”; `src/api/config.js:3-10` deixa propagar o `TypeError` nativo do `fetch` (ex.: `Failed to fetch`). A UI仍然 trata corretamente o erro, mas a mensagem não é padronizada.

### Code Pattern Consistency

OK — estrutura `src/api`, `src/components`, `src/pages`, componentes funcionais, `fetch` nativo, CSS puro, sem dependências extras, sem TypeScript/estado global/roteamento. Nenhuma funcionalidade fora de escopo encontrada.

### Consistência documental

- `verificacao.md:28` afirma que `ErroApi` recebe `onTentarNovamente={carregarDados}`, mas o código usa `onTentarNovamente={tentarNovamente}` em `src/pages/AtividadesPage.jsx:63`. O comportamento está correto; o registro está desatualizado.
- `verificacao.md:45` justifica o README inalterado por “instrução explícita do usuário”, enquanto `tasks.md:6` mantém a tarefa 1.2 pendente — inconsistência entre artefatos.

---

#### Problemas por prioridade

### CRÍTICO (corrigir antes de arquivar)

1. **Tarefa 1.2 incompleta** — `tasks.md:6` / `README.md:1`.  
   **Recomendação:** documentar pré-requisitos, `npm install`, `npm run api` (3001), `npm run dev` e os endpoints `GET /disciplinas`, `GET /atividades?_sort=prazo&_order=asc`, `POST /atividades` no `README.md` e marcar `[x]`; se a omissão for definitiva, remover/marcar a tarefa como ignorada no artefato.

### AVISO (deve corrigir)

1. **Tarefa 7.1 marcada como concluída sem evidência de execução** — `tasks.md:38` vs. `verificacao.md:49`.  
   **Recomendação:** executar os cenários com API/navegador e registrar resultados em `verificacao.md`, ou ajustar a tarefa para deixar explícito que a verificação foi apenas por inspeção de código.

2. **Registro de verificação desatualizado** — `verificacao.md:28` vs. `src/pages/AtividadesPage.jsx:63`.  
   **Recomendação:** corrigir o texto para `onTentarNovamente={tentarNovamente}`, mantendo a observação de que `tentarNovamente` chama `carregarDados` e refaz as duas buscas.

### SUGESTÃO (melhoria)

1. **Mensagem de erro de rede não padronizada** — `src/api/config.js:3-10` vs. `design.md:26`.  
   **Recomendação:** envolver falhas de `fetch` em `try/catch` e lançar `new Error("Não foi possível acessar a API.")`, mantendo o tratamento atual de `!response.ok`.

---

#### Avaliação final

**1 problema crítico encontrado. Corrigir antes de arquivar.**  
Há também **2 avisos** e **1 sugestão**. Nenhuma verificação ficou “não verificada”; a implementação dos 11 requisitos e dos 24 cenários foi confirmada por inspeção de código. Após documentar o README (ou formalizar sua omissão) e alinhar `verificacao.md`, a change estará pronta para arquivamento.
