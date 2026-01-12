# SERVREST-CY 🧪

Projeto de **testes automatizados** da API e da Web do **ServeRest**, utilizando **Cypress**, com foco em testes end-to-end (E2E), organização por camadas e reutilização de comandos.

---

## 📌 Objetivo do Projeto

O objetivo deste projeto é validar:

- Funcionalidades da **API ServeRest** (usuários, login, produtos, carrinhos)
- Fluxos principais da **aplicação Web** (login, cadastro de usuários e produtos)
- Garantir qualidade, regressão e confiabilidade da aplicação

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **Cypress**
- **JavaScript**
- **Bruno** (para testes manuais de API)

---

## 📂 Estrutura do Projeto

```text
SERVREST-CY
├── bruno/                    # Coleções para testes manuais de API
├── cypress/
│   ├── e2e/
│   │   ├── api/               # Testes automatizados de API
│   │   │   ├── carts_api.cy.js
│   │   │   ├── login_api.cy.js
│   │   │   ├── products_api.cy.js
│   │   │   └── users_api.cy.js
│   │   └── web/               # Testes automatizados Web (UI)
│   │       ├── adminCadastroProduto_web.cy.js
│   │       ├── adminCadastroUsuario_web.cy.js
│   │       ├── cadastro_web.cy.js
│   │       └── login_web.cy.js
│   ├── fixtures/              # Massa de dados para os testes
│   ├── support/
│   │   ├── commands/          # Custom Commands
│   │   │   ├── api_commands.js
│   │   │   └── web_commands.js
│   │   ├── factories/         # Fábricas de dados
│   │   │   └── userFactory.js
│   │   ├── requests/          # Requests reutilizáveis da API
│   │   │   ├── carrinhos.js
│   │   │   ├── login.js
│   │   │   ├── products.js
│   │   │   └── users.js
│   │   └── e2e.js              # Configurações globais de suporte
├── node_modules/
├── cypress.config.js          # Configuração do Cypress
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔁 Organização dos Testes

### 📌 Testes de API

Localizados em:

```text
cypress/e2e/api/
```

Cobrem cenários como:
- Cadastro e validação de usuários
- Login e autenticação
- CRUD de produtos
- Criação e validação de carrinhos

Os requests são abstraídos em:

```text
cypress/support/requests/
```

E os comandos reutilizáveis ficam em:

```text
cypress/support/commands/api_commands.js
```

---

### 🌐 Testes Web (UI)

Localizados em:

```text
cypress/e2e/web/
```

Cobrem fluxos como:
- Login de usuário
- Cadastro de usuário
- Cadastro de produtos como administrador

Os comandos reutilizáveis de UI ficam em:

```text
cypress/support/commands/web_commands.js
```

---

## 🧪 Fábricas de Dados

As fábricas de dados são utilizadas para gerar massas dinâmicas, evitando dados estáticos e conflitos nos testes.

Exemplo:

```text
cypress/support/factories/userFactory.js
```

---

## ▶️ Como Executar o Projeto

### 📥 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd SERVREST-CY
```

### 📦 2. Instalar as dependências

```bash
npm install
```

### 🧪 3. Executar os testes

#### Abrir o Cypress (modo interativo)

```bash
npx cypress open
```

#### Executar os testes em modo headless

```bash
npx cypress run
```

---

## ⚙️ Configurações Importantes

As configurações globais do Cypress estão no arquivo:

```text
cypress.config.js
```

Nele você pode configurar:
- `baseUrl`
- Timeouts
- Variáveis de ambiente

---

## 📌 Boas Práticas Aplicadas

- Separação de responsabilidades (tests, commands, requests, factories)
- Reutilização de código
- Organização por tipo de teste (API e Web)
- Dados dinâmicos para evitar flakiness

---

## 👤 Autor

**Pedro Henrique de Andrade Gonçalves**  
Analista de Testes

---

## 📄 Licença

Este projeto é destinado a fins de estudo e prática de automação de testes.

