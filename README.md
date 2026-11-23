# GLIC Estudos

## Projeto e integrantes

**Tema:** agenda de atividades acadêmicas (trabalhos, provas e entregas).

**Problema que resolve:** os prazos das disciplinas ficam espalhados em vários lugares (grupos, e-mails, plataformas), e isso faz o estudante perder entregas. O GLIC Estudos junta tudo numa tela só, com a lista ordenada pelo prazo mais próximo e destaques para atividades **atrasadas** e que **vencem em breve**.

**Integrantes (GLIC):**
- Giovanna Oliveira
- Giovanna Pina
- Lucas Lima
- Igor Ruy
- Cauã
- Cintia

## Framework utilizado

**OpenSpec** (`@fission-ai/openspec` 2.1), usado no **opencode** com o modelo gratuito `opencode/big-pickle`.

Por que escolhemos o OpenSpec:
- **É leve.** O projeto tem uma única funcionalidade, e cada mudança gera só proposta, spec, design e tarefas, sem as várias fases e papéis do BMAD ou do GSD.
- **Só precisa do npm.** O SpecKit exigiria instalar o `uv` (Python) em todas as máquinas do grupo.
- **Os artefatos batem com o que a atividade pede:** spec (`specs/`), plano (`design.md`) e tarefas (`tasks.md`).
- **Tem verificação própria.** A skill `openspec-verify-change` compara o código com os artefatos, e o `openspec validate --strict` confere o formato da spec.

## Como rodar

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
npm run api   # terminal 1: JSON Server em http://localhost:3001
npm run dev   # terminal 2: front em http://localhost:5173
```

Contrato da API (`db.json`):

| Método | Rota | Descrição |
|---|---|---|
| GET | `/disciplinas` | `[{ id, nome }]` |
| GET | `/atividades?_sort=prazo&_order=asc` | Atividades ordenadas por prazo |
| POST | `/atividades` | Cria `{ titulo, disciplinaId, tipo, prazo, prioridade, status }` e retorna 201 |

Para testar os comportamentos de erro, basta parar o `npm run api` e recarregar a página.

Para reproduzir o fluxo SDD no opencode: `/openspec-explore`, depois `/openspec-propose`, `/openspec-apply-change` e `/openspec-verify-change`.

## Onde estão os artefatos

| Artefato | Caminho |
|---|---|
| Proposta (com a revisão do grupo e a aprovação da spec) | [`openspec/changes/archive/2026-11-23-agenda-atividades/proposal.md`](openspec/changes/archive/2026-11-23-agenda-atividades/proposal.md) |
| Spec (11 requisitos, 24 cenários) | [`openspec/changes/archive/2026-11-23-agenda-atividades/specs/agenda-atividades/spec.md`](openspec/changes/archive/2026-11-23-agenda-atividades/specs/agenda-atividades/spec.md) |
| Plano | [`openspec/changes/archive/2026-11-23-agenda-atividades/design.md`](openspec/changes/archive/2026-11-23-agenda-atividades/design.md) |
| Tarefas (com o responsável de cada uma) | [`openspec/changes/archive/2026-11-23-agenda-atividades/tasks.md`](openspec/changes/archive/2026-11-23-agenda-atividades/tasks.md) |
| Relatório de verificação | [`verificacao.md`](verificacao.md) |
| Spec consolidada (publicada pelo `openspec archive`) | [`openspec/specs/agenda-atividades/spec.md`](openspec/specs/agenda-atividades/spec.md) |
| Contexto do projeto para o agente | [`openspec/config.yaml`](openspec/config.yaml) |

**Quem fez cada tarefa:**

| Integrante | Tarefas | Arquivos |
|---|---|---|
| Cauã | 1.1, 1.2: setup, contrato de dados e README | `package.json`, `db.json`, `openspec/`, `README.md` |
| Lucas Lima | 2.0–2.2: clientes HTTP | `src/api/config.js`, `src/api/disciplinas.js`, `src/api/atividades.js` |
| Cintia | 3.1–3.3: estados de carregamento, vazio e erro | `src/components/Carregando.jsx`, `ListaVazia.jsx`, `ErroApi.jsx` |
| Giovanna Oliveira | 4.1, 4.2: listagem e destaques | `src/components/AtividadeItem.jsx`, `AtividadeList.jsx` |
| Giovanna Pina | 5.1–5.3: formulário e validações | `src/components/AtividadeForm.jsx` |
| Igor Ruy | 6.1, 6.2, 7.1: página, integração, estilos e verificação | `src/pages/AtividadesPage.jsx`, `src/App.jsx`, `src/index.css`, `verificacao.md` |

## Reflexão

**Que decisão o agente teria tomado sozinho e a spec evitou?**
- O `<select>` de disciplina devolve string (`"2"`), mas o contrato define `disciplinaId` como número. O plano gerado pelo agente não previa conversão nenhuma. Sem ela, o JSON Server salvaria `"2"`, a busca `Map.get(2)` falharia e toda atividade nova apareceria como "Disciplina indisponível". Registramos no `design.md` a regra `Number(disciplinaId)`, e o código saiu certo de primeira.
- O agente também não tinha decidido o que acontece se `GET /disciplinas` falhar. Sem essa decisão, o formulário apareceria com o select vazio. A spec passou a exigir o mesmo estado de erro da listagem.

**Que inconsistência a validação encontrou? Estava na spec ou no código?**
- **No código.** Três submits disparados no mesmo instante geravam **dois POSTs**, porque o código confiava apenas no atributo `disabled` do botão, que só é aplicado no próximo render. A spec já exigia que "um novo envio não pode ser disparado". Corrigimos com uma trava síncrona (`useRef`).
- O `openspec-verify-change` encontrou outra divergência **entre o código e o design**: o erro de rede saía como `TypeError` nativo, e não como um `Error` legível. Também apontou que a primeira versão do `verificacao.md`, escrita pelo agente, afirmava ter evidências sem ter executado nada.

**Como o framework ajudou (ou atrapalhou) a coordenação do grupo?**
- Ajudou: a tabela de interfaces no `design.md` e o `[Nome]` em cada tarefa permitiram que cada integrante trabalhasse no próprio arquivo sem esperar os outros. Todo acordo ficou nos artefatos (seções "Revisão do grupo"), e não no WhatsApp.
- Atrapalhou um pouco: o agente gera artefatos longos e convincentes, e é fácil aprovar sem ler. Erros como "relation", um trecho sem sentido no design e as questões em aberto só apareceram porque lemos tudo em voz alta. Além disso, o `apply` implementa todas as tarefas de uma vez, então tivemos que combinar a ordem dos commits para cada um registrar a própria parte.

**O que faríamos diferente com outro framework?**
- Com o **SpecKit**, rodaríamos `/speckit.constitution` antes, para fixar regras como "sem bibliotecas extras" e "estrutura src/api, src/components, src/pages", em vez de colocá-las no `config.yaml`.
- Com o **GSD**, aproveitaríamos as fases curtas com subagentes de contexto limpo, o que deixaria cada integrante rodar a própria fase separadamente. Para uma funcionalidade só, porém, seria burocracia demais.
