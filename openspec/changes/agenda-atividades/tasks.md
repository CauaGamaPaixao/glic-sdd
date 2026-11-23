# Tasks

## 1. Setup e contrato de dados

- [x] 1.1 [Cauã] Validar que `db.json` contém `disciplinas` e `atividades` com todos os campos do contrato (`titulo`, `disciplinaId`, `tipo`, `prazo`, `prioridade`, `status`) e incluir ao menos um caso de prazo próximo para exercitar os destaques; verificar com `npm run api` e `GET http://localhost:3001/atividades?_sort=prazo&_order=asc` retornando 200.
- [x] 1.2 [Cauã] Documentar no `README.md` os pré-requisitos, os comandos `npm install`, `npm run api` (porta 3001) e `npm run dev`, e o contrato dos endpoints; verificar que os comandos documentados executam com sucesso.

## 2. Clientes HTTP

- [x] 2.0 [Lucas Lima] Criar `src/api/config.js` exportando a constante `API_URL = "http://localhost:3001"` e um helper de requisição que lança `Error` para falha de rede e para `!response.ok`; verificar que ambos os clientes importam a base deste arquivo.
- [x] 2.1 [Lucas Lima] Criar `src/api/disciplinas.js` com `listarDisciplinas()` (`GET /disciplinas`) usando `API_URL`, lançando erro para rede e para status fora de 2xx; verificar no navegador que a lista de disciplinas é retornada e que forçar a API fora do ar rejeita a promise.
- [x] 2.2 [Lucas Lima] Criar `src/api/atividades.js` com `listarAtividades()` (`GET /atividades?_sort=prazo&_order=asc`) e `criarAtividade(dados)` (`POST /atividades`, JSON), com o mesmo tratamento de erro e base URL; verificar com a API rodando que o GET ordena por prazo e que um POST de teste retorna 201 com o objeto criado.

## 3. Componentes de estado de UI

- [ ] 3.1 [Cintia] Criar `src/components/Carregando.jsx` exibindo indicador textual/visual de carregamento; verificar que o componente aparece ao simular uma busca lenta e desaparece ao concluir.
- [ ] 3.2 [Cintia] Criar `src/components/ListaVazia.jsx` com a mensagem exata "Nenhuma atividade cadastrada"; verificar que aparece somente quando a lista retornada estiver vazia.
- [ ] 3.3 [Cintia] Criar `src/components/ErroApi.jsx` com a mensagem exata "Não foi possível carregar as atividades." e o botão "Tentar novamente" que dispara callback; verificar que o botão chama o callback e que a mensagem é exibida ao simular erro de rede e HTTP 500.

## 4. Listagem de atividades

- [ ] 4.1 [Giovanna Oliveira] Criar `src/components/AtividadeItem.jsx` exibindo título, nome da disciplina recebido por prop (com rótulo para disciplina indisponível), tipo, prazo em `dd/mm/aaaa` e prioridade, calculando os destaques "Atrasada" (vermelho) e "Vence em breve" (amarelo) em datas locais, e exibindo o rótulo "Concluída" sem destaque de prazo para `status: "concluida"`; verificar com três atividades de exemplo: prazo passado, prazo hoje+2 e prazo futuro, observando os rótulos e cores corretos.
- [ ] 4.2 [Giovanna Oliveira] Criar `src/components/AtividadeList.jsx` que percorre as atividades e delega a renderização a `AtividadeItem` mantendo a ordem recebida; verificar que a ordem de prazos exibida corresponde à ordem do `GET` ordenado.

## 5. Formulário de cadastro

- [ ] 5.1 [Giovanna Pina] Criar `src/components/AtividadeForm.jsx` com campos controlados: título, select de disciplina (opções recebidas pela prop `disciplinas`), select de tipo, prazo, select de prioridade com padrão "media", envio fixo de `status: "pendente"` e conversão `Number(disciplinaId)`; verificar que todos os campos aparecem acima da lista e que o payload enviado contém `status: "pendente"` e `disciplinaId` numérico.
- [ ] 5.2 [Giovanna Pina] Implementar validações no submit: título com 3 a 80 caracteres após trim, presença de disciplinaId/tipo/prazo e prazo não anterior a hoje, exibindo mensagens abaixo de cada campo inválido e bloqueando a requisição; verificar que nenhuma chamada de rede ocorre em cada caso inválido e que um título com espaços é validado após trim.
- [ ] 5.3 [Giovanna Pina] Implementar feedback e estados de envio: mensagem "Atividade cadastrada!" e limpeza do formulário no sucesso, mensagem "Não foi possível salvar a atividade. Tente novamente." preservando os valores na falha, e botão desabilitado durante a requisição; verificar todos os casos com a API rodando, com falha de rede e com resposta HTTP 500, observando que um duplo clique não gera dois POSTs.

## 6. Integração na página e estilos

- [ ] 6.1 [Igor Ruy] Criar `src/pages/AtividadesPage.jsx` orquestrando o carregamento paralelo (`Promise.all`) de atividades e disciplinas, estados de carregamento/erro/vazio, callback de nova tentativa e inclusão da atividade criada na lista ordenada sem recarregar; verificar na tela que o formulário fica acima da lista e que, após salvar, o novo item aparece na posição correta do prazo.
- [ ] 6.2 [Igor Ruy] Substituir o placeholder em `src/App.jsx` pela `AtividadesPage` e ajustar `src/index.css` com layout e classes semânticas para os destaques, mensagens e botões; verificar que `npm run build` e `npm run lint` passam sem erros.

## 7. Verificação final

- [ ] 7.1 [Igor Ruy] Registrar em `verificacao.md` o resultado dos cenários do spec: listagem ordenada, dados e destaques, carregamento, vazio, erro ao listar com tentativa, validações, sucesso no cadastro, falha no cadastro com dados preservados e botão desabilitado; verificar que cada cenário possui evidência de execução e que nenhum item fora de escopo foi implementado.

## Revisão do grupo

- Adicionada a tarefa 2.0 (`src/api/config.js`), decorrente da Questão em aberto 1 do design.
- Explicitados os nomes das funções exportadas (2.1, 2.2) conforme a tabela de interfaces do design.
- 4.1 passa a cobrir o rótulo "Concluída"; 5.1 recebe disciplinas por prop e converte `disciplinaId` para number; 6.1 usa carregamento paralelo.
- Ordem de commits combinada: 1.x → 2.x → 3.x → 4.x → 5.x → 6.x → 7.1, cada integrante commitando apenas os próprios arquivos e marcando o próprio `[x]` neste arquivo.

## Workflow follow-up

- Revisar os artefatos com o grupo e, quando aprovado, arquivar a mudança `agenda-atividades`.
