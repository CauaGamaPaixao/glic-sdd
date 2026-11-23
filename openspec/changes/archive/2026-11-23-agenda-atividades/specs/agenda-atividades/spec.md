# Spec Delta

## Purpose

Permite que estudantes consultem e cadastrem atividades acadêmicas em uma única tela, com prazos, prioridades e estados de carregamento, erro e destaque visual.

## ADDED Requirements

### Requirement: Listagem ordenada de atividades

O sistema SHALL buscar atividades ordenadas por prazo ascendente e exibi-las da mais próxima para a mais distante.

#### Scenario: Carregamento da agenda

- **WHEN** a página de atividades é aberta
- **THEN** o sistema solicita as atividades com `_sort=prazo` e `_order=asc` e as exibe em ordem crescente de prazo

### Requirement: Exibição dos dados da atividade

Cada item da listagem SHALL exibir título, nome da disciplina resolvido a partir de `disciplinaId`, tipo, prazo formatado `dd/mm/aaaa` e prioridade.

#### Scenario: Item com disciplina conhecida

- **WHEN** uma atividade possui `disciplinaId` correspondente a uma disciplina carregada
- **THEN** o sistema exibe o nome dessa disciplina, o tipo, o prazo em `dd/mm/aaaa` e a prioridade da atividade

#### Scenario: Item com disciplina não encontrada

- **WHEN** uma atividade possui `disciplinaId` sem correspondência na lista de disciplinas
- **THEN** o sistema exibe um rótulo indicativo de disciplina indisponível sem interromper a listagem

### Requirement: Destaque de prazo

O sistema SHALL destacar visualmente atividades pendentes conforme a relação entre o prazo e a data atual.

#### Scenario: Atividade atrasada

- **WHEN** uma atividade pendente possui prazo anterior à data de hoje
- **THEN** o sistema a exibe com destaque vermelho e o rótulo "Atrasada"

#### Scenario: Atividade vencendo em breve

- **WHEN** uma atividade pendente possui prazo entre hoje e dois dias após hoje, inclusive
- **THEN** o sistema a exibe com destaque amarelo e o rótulo "Vence em breve"

#### Scenario: Atividade sem destaque

- **WHEN** uma atividade possui prazo posterior a dois dias após hoje ou já está concluída
- **THEN** o sistema não aplica os destaques "Atrasada" nem "Vence em breve"

#### Scenario: Atividade concluída na listagem

- **WHEN** a API retorna uma atividade com `status` igual a "concluida"
- **THEN** o sistema a exibe normalmente na listagem, com o rótulo "Concluída" e sem destaque de prazo

### Requirement: Estado de carregamento da listagem

O sistema SHALL exibir um indicador de carregamento enquanto a busca de atividades está em andamento.

#### Scenario: Busca em andamento

- **WHEN** a requisição de listagem ainda não foi concluída
- **THEN** o sistema exibe um estado de carregamento e não exibe a lista nem o estado vazio

### Requirement: Estado vazio

O sistema SHALL exibir "Nenhuma atividade cadastrada" quando a listagem retornar uma lista vazia.

#### Scenario: Nenhuma atividade cadastrada

- **WHEN** a busca retorna uma lista sem atividades
- **THEN** o sistema exibe a mensagem "Nenhuma atividade cadastrada"

### Requirement: Erro ao carregar atividades

Se a listagem falhar por rede ou por status HTTP fora de 2xx, o sistema SHALL exibir "Não foi possível carregar as atividades." e oferecer um botão "Tentar novamente" que refaz a busca.

#### Scenario: API fora do ar ao listar

- **WHEN** a requisição de listagem falha por erro de rede
- **THEN** o sistema exibe "Não foi possível carregar as atividades." e o botão "Tentar novamente"

#### Scenario: HTTP de erro ao listar

- **WHEN** a requisição de listagem retorna status HTTP fora de 2xx
- **THEN** o sistema exibe "Não foi possível carregar as atividades." e o botão "Tentar novamente"

#### Scenario: Falha ao carregar disciplinas

- **WHEN** a requisição `GET /disciplinas` falha por erro de rede ou retorna status HTTP fora de 2xx
- **THEN** o sistema exibe o mesmo estado de erro "Não foi possível carregar as atividades." com o botão "Tentar novamente", sem exibir a lista nem o formulário com o select de disciplina vazio

#### Scenario: Nova tentativa de carregamento

- **WHEN** o usuário aciona o botão "Tentar novamente"
- **THEN** o sistema refaz a busca de atividades e de disciplinas e substitui o estado de erro pelo estado apropriado ao resultado

### Requirement: Formulário de cadastro

O sistema SHALL disponibilizar, acima da listagem, um formulário com os campos título, disciplina, tipo, prazo e prioridade.

#### Scenario: Campos disponíveis

- **WHEN** a página de atividades é carregada
- **THEN** o formulário exibe campo de título, select de disciplina carregado de `/disciplinas`, select de tipo, campo de prazo e select de prioridade com padrão "media"

#### Scenario: Valores de tipo e prioridade

- **WHEN** o usuário preenche o formulário
- **THEN** o tipo MUST ser um de "trabalho", "prova" ou "entrega" e a prioridade MUST ser um de "baixa", "media" ou "alta"

### Requirement: Validação do formulário

O sistema SHALL validar todos os campos obrigatórios antes de enviar qualquer requisição e exibir mensagem de erro abaixo de cada campo inválido.

#### Scenario: Título inválido

- **WHEN** o título, após trim, possui menos de 3 ou mais de 80 caracteres
- **THEN** o sistema exibe uma mensagem de erro abaixo do campo título e não envia a requisição

#### Scenario: Campos obrigatórios ausentes

- **WHEN** disciplina, tipo ou prazo não foram informados
- **THEN** o sistema exibe mensagem de erro abaixo de cada campo ausente e não envia a requisição

#### Scenario: Prazo anterior a hoje

- **WHEN** o prazo informado é anterior à data de hoje
- **THEN** o sistema exibe uma mensagem de erro abaixo do campo prazo e não envia a requisição

#### Scenario: Formulário válido

- **WHEN** todos os campos atendem às regras de validação
- **THEN** o sistema envia uma requisição `POST /atividades` com `status` igual a "pendente"

### Requirement: Sucesso no cadastro

Após uma resposta 2xx do cadastro, o sistema SHALL limpar o formulário, exibir "Atividade cadastrada!" e incluir a nova atividade na listagem sem recarregar a página.

#### Scenario: Cadastro confirmado

- **WHEN** o `POST /atividades` retorna status 2xx
- **THEN** o sistema limpa o formulário, exibe "Atividade cadastrada!" e adiciona a atividade retornada à lista ordenada por prazo sem recarregar a página

### Requirement: Falha ao salvar atividade

Se o cadastro falhar por rede ou por status HTTP fora de 2xx, o sistema SHALL exibir "Não foi possível salvar a atividade. Tente novamente." e MANTER os dados digitados no formulário.

#### Scenario: API fora do ar ao salvar

- **WHEN** o `POST /atividades` falha por erro de rede
- **THEN** o sistema exibe "Não foi possível salvar a atividade. Tente novamente." e mantém os valores digitados no formulário

#### Scenario: HTTP de erro ao salvar

- **WHEN** o `POST /atividades` retorna status fora de 2xx
- **THEN** o sistema exibe "Não foi possível salvar a atividade. Tente novamente." e mantém os valores digitados no formulário

### Requirement: Bloqueio contra cadastro duplicado

O sistema SHALL manter o botão de salvar desabilitado enquanto a requisição de cadastro está em andamento.

#### Scenario: Envio em andamento

- **WHEN** a requisição de cadastro foi iniciada e ainda não foi concluída
- **THEN** o botão de salvar permanece desabilitado e um novo envio não pode ser disparado

#### Scenario: Fim da requisição

- **WHEN** a requisição de cadastro termina com sucesso ou falha
- **THEN** o botão de salvar volta a ficar habilitado
