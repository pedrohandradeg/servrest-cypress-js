import { userFactory } from '../../support/factories/userFactory'

describe('Login', () => {

  let user
  let admin

  before(() => {
    user = userFactory.generateUser()
    admin = userFactory.generateUser('true')

    cy.createUser(user)
    cy.createUser(admin)
  })

  beforeEach(() => {
    cy.intercept('POST', 'https://serverest.dev/login').as('postLogin')
    cy.intercept('GET', 'https://serverest.dev/produtos').as('getProdutos')
    cy.intercept('GET', 'https://serverest.dev/usuarios').as('getUsuarios')

    cy.visit('/login')
  })

  it('Deve realizar login como usuário comum com sucesso', () => {
    cy.signIn(user)

    cy.wait(['@postLogin', '@getUsuarios', '@getProdutos'])

    cy.get('h1').should('contain', 'Serverest Store')
    cy.get('button').contains('Pesquisar').should('be.visible')
  })

  it('Deve realizar login como administrador com sucesso', () => {
    cy.signIn(admin)

    cy.wait(['@postLogin', '@getUsuarios'])

    cy.get('h1').should('have.text', `Bem Vindo  ${admin.nome}`)
    cy.get('.lead').should('have.text', 'Este é seu sistema para administrar seu ecommerce.')
  })

  it('Deve validar os campos obrigatórios', () => {
    cy.submitLogin()

    cy.wait('@postLogin').then((postLogin) => {
      expect(postLogin.response.statusCode).to.eq(400)
    })

    const warnings = [
      'Email é obrigatório',
      'Password é obrigatório'
    ]

    warnings.forEach(msg => {
      cy.contains(msg).should('be.visible')
    })
  })

  it('Deve acessar a página de cadastro', () => {
    cy.goToCadastro()
    cy.url().should('include', '/cadastrarusuarios')
    cy.get('h2').should('have.text', 'Cadastro').and('be.visible')
  })
})