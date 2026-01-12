import { userFactory } from '../../support/factories/userFactory'

describe('Fluxo de produtos - API', () => {

    let tokenAdmin
    let tokenUser
    let product

    before(() => {
        const admin = userFactory.generateUser('true')
        const user = userFactory.generateUser()

        cy.createUser(admin).then(token => tokenAdmin = token)
        cy.createUser(user).then(token => tokenUser = token)
    })

    beforeEach(() => {
        product = userFactory.generateProduct()
    })

    context('Cenários de sucesso', () => {
        it('Deve cadastrar um produto', () => {
            cy.postProduct(product, tokenAdmin).then((resPostProduct) => {
                expect(resPostProduct.status).to.eq(201)
                expect(resPostProduct.body.message).to.eq('Cadastro realizado com sucesso')
                expect(resPostProduct.body._id).to.not.be.empty

                const id = resPostProduct.body._id

                cy.getProductById(id).then((resGetProduct) => {
                    expect(resGetProduct.body.nome).to.eq(product.nome)
                })
            })
        })

        it('Deve consultar um produto pelo Id', () => {
            cy.postProduct(product, tokenAdmin).then((resPostProduct) => {
                expect(resPostProduct.status).to.eq(201)

                const id = resPostProduct.body._id

                cy.getProductById(id).then((resGetProduct) => {
                    expect(resGetProduct.status).to.eq(200)
                    expect(resGetProduct.body).to.include({
                        nome: product.nome,
                        preco: product.preco,
                        descricao: product.descricao,
                        quantidade: product.quantidade,
                        _id: id
                    })
                })
            })
        })

        it('Deve editar um produto', () => {
            const productEdit = userFactory.generateProduct()

            cy.postProduct(product, tokenAdmin).then((resPostProduct) => {
                const id = resPostProduct.body._id

                cy.putProduct(id, productEdit, tokenAdmin).then((resPutProduct) => {
                    expect(resPutProduct.status).to.eq(200)
                    expect(resPutProduct.body.message).to.eq('Registro alterado com sucesso')
                })
            })
        })

        it('Deve excluir um produto', () => {
            cy.postProduct(product, tokenAdmin).then((resPostProduct) => {
                const id = resPostProduct.body._id

                cy.deleteProduct(id, tokenAdmin).then((resDeleteProduct) => {
                    expect(resDeleteProduct.status).to.eq(200)
                    expect(resDeleteProduct.body.message).to.eq('Registro excluído com sucesso')
                })

                cy.getProductById(id).then((resGetProduct) => {
                    expect(resGetProduct.body.message).to.eq('Produto não encontrado')
                })
            })
        })
    })

    context('Cenários de autorização e erros', () => {
        it('Não deve cadastrar um produto já existente', () => {
            cy.postProduct(product, tokenAdmin).then(() => {
                cy.postProduct(product, tokenAdmin).then((resPostProduct) => {
                    expect(resPostProduct.status).to.eq(400)
                    expect(resPostProduct.body.message).to.eq('Já existe produto com esse nome')
                })
            })
        })

        it('Não deve cadastrar um produto com token inexistente ou inválido', () => {
            cy.postProduct(product).then((resPostProduct) => {
                expect(resPostProduct.status).to.eq(401)
                expect(resPostProduct.body.message).to.contain('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
            })
        })

        it('Não deve cadastrar um produto com token diferente de admin', () => {
            cy.postProduct(product, tokenUser).then((resPostProduct) => {
                expect(resPostProduct.status).to.eq(403)
                expect(resPostProduct.body.message).to.eq('Rota exclusiva para administradores')
            })
        })

        it('Não deve encontrar produto com id inexistente', () => {
            cy.getProductById('1234567891011121').then((resGetProduct) => {
                expect(resGetProduct.status).to.eq(400)
                expect(resGetProduct.body.message).to.eq('Produto não encontrado')
            })
        })

        it('Não deve encontrar produto com id inválido', () => {
            cy.getProductById('1').then((resGetProduct) => {
                expect(resGetProduct.status).to.eq(400)
                expect(resGetProduct.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos')
            })
        })

        it('Não deve editar produto com token inexistente ou inválido', () => {
            cy.postProduct(product, tokenAdmin).then((resPostProduct) => {
                const id = resPostProduct.body._id

                cy.putProduct(id, product).then((resPutProduct) => {
                    expect(resPutProduct.status).to.eq(401)
                    expect(resPutProduct.body.message).to.contain('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
                })
            })
        })

        it('Não deve editar produto com token diferente de admin', () => {
            cy.postProduct(product, tokenAdmin).then((resPostProduct) => {
                const idProduct = resPostProduct.body._id

                cy.putProduct(idProduct, product, tokenUser).then((resPutProduct) => {
                    expect(resPutProduct.status).to.eq(403)
                    expect(resPutProduct.body.message).to.eq('Rota exclusiva para administradores')
                })
            })
        })

        it('Não deve excluir produto com token inexistente ou inválido', () => {
            cy.postProduct(product, tokenAdmin).then((resPostProduct) => {
                const idProduct = resPostProduct.body._id

                cy.deleteProduct(idProduct).then((resDeleteProduct) => {
                    expect(resDeleteProduct.status).to.eq(401)
                    expect(resDeleteProduct.body.message).to.contain('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
                })
            })
        })

        it('Não deve excluir produto com token diferente de admin', () => {
            cy.postProduct(product, tokenAdmin).then((resPostProduct) => {
                const id = resPostProduct.body._id

                cy.deleteProduct(id, tokenUser).then((resDeleteProduct) => {
                    expect(resDeleteProduct.status).to.eq(403)
                    expect(resDeleteProduct.body.message).to.eq('Rota exclusiva para administradores')
                })
            })
        })

        it('Não deve excluir produto que pertence a um carrinho', () => {
            cy.postProduct(product, tokenAdmin).then((resPostProduct) => {
                const id = resPostProduct.body._id

                cy.postCart(id, 2, tokenUser).then((resPostCart) => {
                    const idCart = resPostCart.body._id

                    cy.deleteProduct(id, tokenAdmin).then((resDeleteProduct) => {
                        expect(resDeleteProduct.status).to.eq(400)
                        expect(resDeleteProduct.body.message).to.eq('Não é permitido excluir produto que faz parte de carrinho')
                        expect(resDeleteProduct.body.idCarrinhos).to.include(idCart)
                    })
                })
            })
        })
    })
})