Cypress.Commands.add('signIn', (user) => {
    cy.get('#email').type(user.email)
    cy.get('#password').type(user.password)

    cy.submitLogin()
})

Cypress.Commands.add('submitLogin', () => {
    cy.contains('button', 'Entrar').click()
})

Cypress.Commands.add('goToCadastro', () => {
    cy.get('[data-testid="cadastrar"]').click()
})

Cypress.Commands.add('registerUser', (user) => {
    cy.get('#nome').type(user.nome)
    cy.get('#email').type(user.email)
    cy.get('#password').type(user.password)

    if (user.administrador === 'true') {
        cy.get('[data-testid="checkbox"]').click()
    }

    cy.submitRegister()
})

Cypress.Commands.add('submitRegister', () => {
    cy.contains('button', 'Cadastrar').click()
})

Cypress.Commands.add('goToLogin', () => {
    cy.get('[data-testid="entrar"]').click()
})

Cypress.Commands.add('goToCadastroUsuario', () => {
    cy.get('[data-testid="cadastrarUsuarios"]').click()
})

Cypress.Commands.add('goToCadastroProduto', () => {
    cy.get('[data-testid="cadastrarProdutos"]').click()
})

Cypress.Commands.add('registerProduct', (product) => {
    cy.get('#nome').type(product.nome)
    cy.get('#price').type(product.preco)
    cy.get('#description').type(product.descricao)
    cy.get('#quantity').type(product.quantidade)

    cy.submitRegister()
})