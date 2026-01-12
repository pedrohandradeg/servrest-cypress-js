import { userFactory } from '../../support/factories/userFactory'

describe('Cadastro', () => {

  beforeEach(() => {
    cy.intercept('POST', 'https://serverest.dev/usuarios').as('postUsuarios')
    cy.intercept('POST', 'https://serverest.dev/login').as('postLogin')
    cy.intercept('GET', 'https://serverest.dev/produtos').as('getProdutos')
    cy.intercept('GET', 'https://serverest.dev/usuarios').as('getUsuarios')

    cy.visit('/cadastrarusuarios')
  })

  it('Deve realizar o cadastro de um usuário comum com sucesso', () => {
    const user = userFactory.generateUser()

    cy.registerUser(user)

    cy.contains('Cadastro realizado com sucesso').should('be.visible')
    cy.wait(['@postUsuarios', '@postLogin', '@getProdutos'])

    cy.get('h1').should('have.text', 'Serverest Store')
    cy.get('button').contains('Pesquisar').should('be.visible')
  })

  it('Deve realizar o cadastro de um administrador com sucesso', () => {
    const admin = userFactory.generateUser('true')

    cy.registerUser(admin)

    cy.contains('Cadastro realizado com sucesso').should('be.visible')
    cy.wait(['@postUsuarios', '@postLogin', '@getUsuarios'])

    cy.get('h1').should('have.text', `Bem Vindo  ${admin.nome}`)
    cy.get('.lead').should('have.text', 'Este é seu sistema para administrar seu ecommerce.')
  })

  it('Deve validar os campos obrigatórios', () => {
    cy.submitRegister()

    cy.wait('@postUsuarios').then((postUsuarios) => {
      expect(postUsuarios.response.statusCode).to.eq(400)
    })

    const warnings = [
      'Nome é obrigatório',
      'Email é obrigatório',
      'Password é obrigatório'
    ]

    warnings.forEach(msg => {
      cy.contains(msg).should('be.visible')
    })
  })

  it('Deve acessar a página de login', () => {
    cy.goToLogin()
    cy.url().should('include', '/login')
    cy.get('h1').should('have.text', 'Login').and('be.visible')
  })
})