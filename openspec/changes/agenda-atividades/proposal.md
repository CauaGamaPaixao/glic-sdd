# Proposal

## Why

Estudantes perdem prazos de trabalhos, provas e entregas porque essas informações ficam espalhadas em vários lugares. O GLIC Estudos ainda não oferece uma tela única para consultar e cadastrar atividades acadêmicas com seus prazos.

## What Changes

- Adiciona uma página `AtividadesPage` com formulário de cadastro e listagem de atividades na mesma tela.
- Lista atividades ordenadas por prazo ascendente, exibindo título, disciplina (resolvida por `disciplinaId`), tipo, prazo em `dd/mm/aaaa` e prioridade.
- Aplica destaque visual de prazo: "Atrasada" (vermelho) e "Vence em breve" (amarelo).
- Implementa estados de carregamento, lista vazia e erro de carregamento com ação de nova tentativa.
- Implementa cadastro com validações no cliente, envio via `POST /atividades` e atualização da lista sem recarregar a página.
- Implementa tratamento de falha no cadastro preservando os dados digitados e bloqueando o botão de salvar durante a requisição.
- Cria clientes HTTP para `disciplinas` e `atividades` com base URL configurável e erro explícito para status fora de 2xx.
- Ajusta `db.json`, `README.md`, `App.jsx` e `index.css` para integrar a nova funcionalidade.

Fora de escopo: edição, exclusão, marcar como concluída, login e filtros.

## Capabilities

### New Capabilities

- `agenda-atividades`: Listagem e cadastro de atividades acadêmicas com prazos, prioridades, validações, estados de carregamento/erro e resolução do nome da disciplina.

### Modified Capabilities

Nenhuma. O projeto ainda não possui specs publicadas.

## Impact

- **Código-fonte**: novos arquivos em `src/api/`, `src/components/` e `src/pages/`; alterações em `src/App.jsx`, `src/index.css`, `db.json` e `README.md`.
- **API**: JSON Server 0.17 em `http://localhost:3001`, com os endpoints `GET /disciplinas`, `GET /atividades?_sort=prazo&_order=asc` e `POST /atividades`.
- **Dependências**: nenhuma nova biblioteca; React 19, Vite, `fetch` nativo e CSS puro.
- **Responsáveis**: Cauã (setup/db/artefatos/README), Lucas Lima (API), Giovanna Oliveira (listagem), Giovanna Pina (formulário), Cintia (estados de UI), Igor Ruy (página/integração/verificação final).

## Revisão do grupo

Spec lida em grupo e corrigida antes de seguir para o plano (sessão única do opencode, modelo `opencode/big-pickle`):

- Corrigida a palavra em inglês "relation" para "relação" no requisito de destaque de prazo.
- **Lacuna encontrada:** a spec não dizia o que acontece se `GET /disciplinas` falhar. Adicionado o cenário "Falha ao carregar disciplinas" (mesmo estado de erro, e "Tentar novamente" refaz as duas buscas).
- Adicionado o cenário "Atividade concluída na listagem" (rótulo "Concluída", sem destaque), que o agente tinha deixado como questão em aberto.

Aprovação da spec: Cauã ☑ · Lucas Lima ☑ · Giovanna Oliveira ☑ · Giovanna Pina ☑ · Cintia ☑ · Igor Ruy ☑ (aprovada em 23/11/2026)
