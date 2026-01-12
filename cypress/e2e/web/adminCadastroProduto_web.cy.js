import { userFactory } from '../../support/factories/userFactory'

describe('Testes de cadastro de produto realizados com admin', () => {
    let admin
    let duplicateProduct

    before(() => {
        admin = userFactory.generateUser('true')
        duplicateProduct = userFactory.generateProduct()

        cy.createUser(admin).then(token => {
            cy.postProduct(duplicateProduct, token).then(resPostProduct => {
                expect(resPostProduct.status).to.eq(201)
            }) 
        })
    })

    beforeEach(() => {
        cy.intercept('POST', 'https://serverest.dev/login').as('postLogin')
        cy.intercept('POST', 'https://serverest.dev/usuarios').as('postUsuarios')
        cy.intercept('GET', 'https://serverest.dev/usuarios').as('getUsuarios')
        cy.intercept('POST', 'https://serverest.dev/produtos').as('postProdutos')

        cy.visit('/login')

        cy.signIn(admin)

        cy.wait(['@postLogin', '@getUsuarios'])

        cy.goToCadastroProduto()
    })

    it('Deve cadastrar um produto com sucesso', () => {
        const product = userFactory.generateProduct()

        cy.registerProduct(product)

        cy.wait('@postProdutos')
    })

    it('Não deve cadastrar um produto já existente', () => {
        cy.registerProduct(duplicateProduct)

        cy.contains('Já existe produto com esse nome').should('be.visible')

        cy.wait('@postProdutos').then((postProdutos) => {
            expect(postProdutos.response.statusCode).to.eq(400)
        })
    })

    it('Deve validar os campos obrigatórios', () => {
        cy.submitRegister()

        const warnings = [
            'Nome é obrigatório',
            'Preco é obrigatório',
            'Descricao é obrigatório',
            'Quantidade é obrigatório'
        ]

        warnings.forEach(msg => {
            cy.contains(msg).should('be.visible')
        })

        cy.wait('@postProdutos').then((postProdutos) => {
            expect(postProdutos.response.statusCode).to.eq(400)
        })

    })
})