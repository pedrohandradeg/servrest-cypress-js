import { userFactory } from '../../support/factories/userFactory'

describe('Testes de cadastro de usuário relizados com admin', () => {
    let admin

    before(() => {
        admin = userFactory.generateUser('true')
        cy.createUser(admin)
    })

    beforeEach(() => {
        cy.intercept('POST', 'https://serverest.dev/login').as('postLogin')
        cy.intercept('POST', 'https://serverest.dev/usuarios').as('postUsuarios')
        cy.intercept('GET', 'https://serverest.dev/usuarios').as('getUsuarios')
        cy.visit('/login')

        cy.signIn(admin)

        cy.wait(['@postLogin', '@getUsuarios'])

        cy.goToCadastroUsuario()
    })

    it('Deve cadastrar um usuario com sucesso', () => {
        const user = userFactory.generateUser()

        cy.registerUser(user)

        cy.wait(['@postUsuarios', '@getUsuarios'])
    })

    it('Deve cadastrar um admin com sucesso', () => {
        const user = userFactory.generateUser('true')

        cy.registerUser(user)

        cy.wait(['@postUsuarios', '@getUsuarios'])
    })

    it('Deve validar os campos obrigatórios', () => {
        cy.submitRegister()

        const warnings = [
            'Nome é obrigatório',
            'Email é obrigatório',
            'Password é obrigatório'
        ]

        warnings.forEach(msg => {
            cy.contains(msg).should('be.visible')
        })
    })

    it('Não deve cadastrar usuário com email já cadastrado', () => {
        cy.registerUser(admin)

        cy.contains('Este email já está sendo usado').should('be.visible')

        cy.wait('@postUsuarios').then((postUsuarios) => {
            expect(postUsuarios.response.statusCode).to.eq(400)
        })
    })
})