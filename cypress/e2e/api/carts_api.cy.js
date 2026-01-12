import { userFactory } from '../../support/factories/userFactory'



describe('Fluxo de carrinhos de compra - API', () => {

    let idProduct
    let tokenUser

    before(() => {
        const admin = userFactory.generateUser('true')

        cy.createUser(admin).then(tokenAdmin => {
            const product = userFactory.generateProduct()

            cy.postProduct(product, tokenAdmin).then(resPostProduct => {
                idProduct = resPostProduct.body._id
            })
        })
    })

    beforeEach(() => {
        const user = userFactory.generateUser()
        cy.createUser(user).then(token => tokenUser = token)
    })

    context('Cenários de sucesso', () => {
        it('Deve cadastrar um carrinho', () => {
            cy.postCart(idProduct, 2, tokenUser).then((resPostCart) => {
                expect(resPostCart.status).to.eq(201)
                expect(resPostCart.body.message).to.eq('Cadastro realizado com sucesso')
                expect(resPostCart.body._id).to.not.be.empty

                const idCart = resPostCart.body._id

                cy.getCartById(idCart).then((resGetCart) => {
                    expect(resGetCart.body).to.have.nested.property('produtos[0].idProduto', idProduct)
                    expect(resGetCart.body._id).to.eq(idCart)
                })
            })
        })

        it('Deve consultar carrinho pelo Id', () => {
            cy.postCart(idProduct, 2, tokenUser).then((resPostCart) => {
                const idCart = resPostCart.body._id

                cy.getCartById(idCart).then((resGetCart) => {
                    expect(resGetCart.status).to.eq(200)
                    expect(resGetCart.body).to.have.nested.property('produtos[0].idProduto').and.not.be.empty
                    expect(resGetCart.body.idUsuario).to.not.be.empty
                    expect(resGetCart.body._id).to.eq(idCart)
                })
            })
        })

        it('Deve concluir uma compra', () => {
            cy.postCart(idProduct, 2, tokenUser).then(() => {
                cy.deleteCompletePurchase(tokenUser).then((resDeleteComplete) => {
                    expect(resDeleteComplete.status).to.eq(200)
                    expect(resDeleteComplete.body.message).to.eq('Registro excluído com sucesso')
                })
            })
        })

        it('Deve validar se usuário possui carrinho cadastrado para concluir compra', () => {
            cy.deleteCompletePurchase(tokenUser).then((resDeleteComplete) => {
                expect(resDeleteComplete.status).to.eq(200)
                expect(resDeleteComplete.body.message).to.eq('Não foi encontrado carrinho para esse usuário')
            })
        })

        it('Deve excluir o carrinho', () => {
            cy.postCart(idProduct, 2, tokenUser).then(() => {
                cy.deleteCancelPurchase(tokenUser).then((resDeleteCancel) => {
                    expect(resDeleteCancel.status).to.eq(200)
                    expect(resDeleteCancel.body.message).to.eq('Registro excluído com sucesso. Estoque dos produtos reabastecido')
                })
            })
        })

        it('Deve validar se usuário possui carrinho cadastrado para cancelar compra', () => {
            cy.deleteCancelPurchase(tokenUser).then((resDeleteCancel) => {
                expect(resDeleteCancel.status).to.eq(200)
                expect(resDeleteCancel.body.message).to.eq('Não foi encontrado carrinho para esse usuário')
            })
        })
    })

    context('Cenários de erros e autorização', () => {
        it('Não deve cadastrar mais de 1 carrinho para um usuário', () => {
            cy.postCart(idProduct, 2, tokenUser).then(() => {
                cy.postCart(idProduct, 3, tokenUser).then((resPostCart) => {
                    expect(resPostCart.status).to.eq(400)
                    expect(resPostCart.body.message).to.eq('Não é permitido ter mais de 1 carrinho')
                })
            })
        })

        it('Não deve cadastrar um carrinho com produto inexistente', () => {
            cy.postCart('123456789011121', 2, tokenUser).then((resPostCart) => {
                expect(resPostCart.status).to.eq(400)
                expect(resPostCart.body.message).to.eq('Produto não encontrado')
            })
        })

        it('Não deve cadastrar um carrinho com token inválido ou inexistente', () => {
            cy.postCart(idProduct, 2).then((resPostCart) => {
                expect(resPostCart.status).to.eq(401)
                expect(resPostCart.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
            })
        })

        it('Não deve consultar carrinho com id inexistente', () => {
            cy.getCartById('1234567891011121').then((resGetCart) => {
                expect(resGetCart.status).to.eq(400)
                expect(resGetCart.body.message).to.eq('Carrinho não encontrado')
            })
        })

        it('Não deve concluir compra com token inválido ou inexistente', () => {
            cy.deleteCompletePurchase().then((resDeleteComplete) => {
                expect(resDeleteComplete.status).to.eq(401)
                expect(resDeleteComplete.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
            })
        })

        it('Não deve cancelar compra com token inválido ou inexistente', () => {
            cy.deleteCancelPurchase().then((resDeleteCancel) => {
                expect(resDeleteCancel.status).to.eq(401)
                expect(resDeleteCancel.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
            })
        })
    })
})