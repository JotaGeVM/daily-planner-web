# 🗓️ Daily Planner Web

Frontend em **React** (Vite) para o Daily Planner, com autenticação de usuário, visões de calendário (Hoje, Semana, Mês), acompanhamento de hábitos com streak e estrutura feature-first.

Projeto de portfólio, construído em conjunto com a [Daily Planner API](https://github.com/JotaGeVM/daily-planner-api) (Spring Boot).

Backend deste projeto: [daily-planner-api](https://github.com/JotaGeVM/daily-planner-api)

Aplicação em produção: `https://daily-planner-web-sandy.vercel.app`

---

## 🚀 Tecnologias utilizadas

- **React**
- **Vite**
- **React Router** (`react-router-dom`)
- **CSS puro** (variáveis CSS para o tema, organizado por feature)
- **Fetch API** (sem bibliotecas externas de requisição)
- **ESLint**, incluindo as regras do plugin `react-hooks` para hooks

---

## ✨ Funcionalidades

### 🔐 Autenticação

- Cadastro e login de usuário, com token JWT armazenado no navegador.
- Sessão persiste entre recarregamentos de página; logout limpa o token e o estado local.
- Redirecionamento automático para a tela de login quando o token expira ou é inválido.

### 🏠 Visão Hoje

- Tela inicial após o login, reunindo em uma única lista as tarefas e ocorrências de hábitos do dia atual.
- Marcação de progresso de hábitos diretamente na lista, com o card do hábito desaparecendo da visão assim que a meta diária é atingida.
- Modal de confirmação para marcar uma ocorrência.

### 🗓️ Calendário (Semana e Mês)

- Visão semanal em grade, mostrando a recorrência de cada tarefa expandida dia a dia.
- Visão mensal em formato de calendário tradicional, com navegação entre meses.
- Ambas consomem o endpoint de expansão de recorrência do backend, sem duplicar essa lógica no frontend.

### 🔥 Hábitos

- Terceiro tipo de tarefa, com meta diária configurável (`metaDiaria`) e data de início.
- Card de progresso com barra visual e contagem (ex: `3/5`), sem exibir controles de incremento e decremento diretamente no card.
- Cartão de streak dedicado, mostrando a sequência atual de dias cumpridos e a melhor sequência já alcançada.

### 📋 Tarefas, categorias e ocorrências

- CRUD completo de **Tarefas** e **Categorias**, com formulários de criação/edição reaproveitados (mesmo componente para os dois modos).
- **Checkbox de conclusão diária**: marcar uma tarefa como feita hoje cria automaticamente um registro de ocorrência; desmarcar remove o registro.
- **Painel de detalhes da tarefa**, com histórico de todas as conclusões passadas (data e hora) e atalho para edição.
- **Painel de detalhes da categoria**, listando as tarefas vinculadas a ela, com navegação direta para os detalhes de qualquer uma.
- **Gesto de deslizar para deletar** (estilo Todoist/Gmail), em tarefas, categorias e registros de conclusão.
- Cor de identificação por categoria, refletida dinamicamente nos cards de tarefas e categorias.

### 🎨 Interface

- **Tema claro/escuro**, com preferência salva entre sessões (`localStorage`).
- **Validação de formulários** com mensagens de erro customizadas por campo, incluindo erros retornados pelo backend (nome duplicado, campos obrigatórios).
- **Layout responsivo**, com listas em coluna única em telas pequenas e em grade em telas maiores.
- Bloqueio de seleção de texto nos cards de tarefa e ocorrência, para não atrapalhar o gesto de deslizar.

---

## 🗂️ Estrutura do projeto

src/
├── features/
│ ├── auth/ # formulário de login e cadastro
│ ├── tarefas/ # tarefas, hábitos e seus componentes
│ ├── categorias/
│ └── ocorrencias/
├── pages/ # TarefasPage, SemanaPage, MesPage e estilos de calendário
├── shared/
│ ├── api/ # cliente HTTP e tratamento de erros
│ ├── auth/ # armazenamento do token
│ ├── components/ # componentes reutilizáveis (ex: SwipeToDelete, NavBar)
│ └── styles/ # tema e variáveis globais
├── App.jsx # rotas e orquestração do estado compartilhado entre features
└── main.jsx

---

## ⚙️ Como rodar o projeto localmente

### Pré-requisitos

- Node.js
- A [Daily Planner API](https://github.com/JotaGeVM/daily-planner-api) rodando em `http://localhost:8080`

### 1. Clone o repositório

```bash
git clone https://github.com/JotaGeVM/daily-planner-web.git
cd daily-planner-web
```

### 2. Instale as dependências e rode

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## ✅ Melhorias implementadas

- Autenticação de usuário com token JWT e sessão persistente.
- Rotas com React Router, separando Hoje, Tarefas, Semana e Mês.
- Terceiro tipo de tarefa, "hábito", com meta diária e cartão de streak.
- Visões de calendário semanal e mensal, consumindo o endpoint de recorrência do backend.
- Consumo de listas paginadas retornadas pelo backend.
- Estado de tarefas e ocorrências centralizado em `App.jsx` (lifting state up), compartilhado entre as features.
- Navegação cruzada: é possível abrir os detalhes de uma tarefa a partir da tela de detalhes da categoria à qual ela pertence.
- Componente `SwipeToDelete` reutilizável, construído com Pointer Events (funciona com mouse e toque).
- Validação de formulários customizada, com sincronização dos erros de validação vindos do backend.
- Passe de responsividade para telas de celular, incluindo troca entre lista e grade conforme o tamanho da tela.

---

## 🔭 Próximos passos

- Suporte a padrões de recorrência mais flexíveis (RRULE), acompanhando a evolução do backend.
- Migração para TypeScript.
- Testes automatizados (Vitest + Testing Library).
- Melhorias de acessibilidade (ARIA, gerenciamento de foco em modais).

---

## 👤 Autor

Desenvolvido por **João Gustavo** ([@JotaGeVM](https://github.com/JotaGeVM)) como projeto de portfólio.
