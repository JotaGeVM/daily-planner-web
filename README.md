# 🗓️ Daily Planner Web

Frontend em **React** (Vite) para o Daily Planner, desenvolvido com estrutura feature-first, gerenciamento de estado centralizado e tema claro/escuro.

Projeto de portfólio, construído em conjunto com a [Daily Planner API](https://github.com/JotaGeVM/daily-planner-api) (Spring Boot).

Backend deste projeto: [daily-planner-api](https://github.com/JotaGeVM/daily-planner-api)

---

## 🚀 Tecnologias utilizadas

- **React**
- **Vite**
- **CSS puro** (variáveis CSS para o tema, organizado por feature)
- **Fetch API** (sem bibliotecas externas de requisição)

---

## ✨ Funcionalidades

- CRUD completo de **Tarefas** e **Categorias**, com formulários de criação/edição reaproveitados (mesmo componente para os dois modos)
- **Checkbox de conclusão diária**: marcar uma tarefa como feita hoje cria automaticamente um registro de ocorrência; desmarcar remove o registro
- **Painel de detalhes da tarefa**, com histórico de todas as conclusões passadas (data e hora) e atalho para edição
- **Painel de detalhes da categoria**, listando as tarefas vinculadas a ela, com navegação direta para os detalhes de qualquer uma
- **Gesto de deslizar para deletar** (estilo Todoist/Gmail), em tarefas, categorias e registros de conclusão
- **Tema claro/escuro**, com preferência salva entre sessões (`localStorage`)
- **Validação de formulários** com mensagens de erro customizadas por campo, incluindo erros retornados pelo backend (nome duplicado, campos obrigatórios)
- **Layout responsivo**, adaptado para telas de celular
- Cor de identificação por categoria, refletida dinamicamente nos cards de tarefas e categorias

---

## 🗂️ Estrutura do projeto

```
src/
├── features/
│   ├── tarefas/
│   ├── categorias/
│   └── ocorrencias/
├── shared/
│   ├── api/          # cliente HTTP e tratamento de erros
│   ├── components/    # componentes reutilizáveis (ex: SwipeToDelete)
│   └── styles/        # tema e variáveis globais
├── App.jsx            # orquestração do estado compartilhado entre features
└── main.jsx
```

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

- Estado de tarefas e ocorrências centralizado em `App.jsx` (lifting state up), compartilhado entre as features de tarefas e categorias
- Navegação cruzada: é possível abrir os detalhes de uma tarefa a partir da tela de detalhes da categoria à qual ela pertence
- Modais fecham automaticamente ao clicar fora
- Componente `SwipeToDelete` reutilizável, construído com Pointer Events (funciona com mouse e toque)
- Validação de formulários customizada, com sincronização dos erros de validação vindos do backend
- Passe de responsividade para telas de celular

---

## 🔭 Próximos passos

- Visão "Hoje", agregando as ocorrências do dia de todas as tarefas em um só lugar
- Testes automatizados (Vitest + Testing Library)
- Migração para TypeScript
- Melhorias de acessibilidade (ARIA, gerenciamento de foco em modais)
- Deploy (Vercel ou Netlify)

---

## 👤 Autor

Desenvolvido por **João Gustavo** ([@JotaGeVM](https://github.com/JotaGeVM)) como projeto de portfólio.
