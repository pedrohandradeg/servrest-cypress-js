import { userFactory } from '../../support/factories/userFactory'

describe('fluxo de usuário - API', () => {
    let userData

    beforeEach(() => {
        userData = userFactory.generateUser()
    })

    context('Cenários de sucesso', () => {
        it('Deve realizar um cadastro de um usuário comum', () => {
            cy.postUser(userData).then((resPostUser) => {
                expect(resPostUser.status).to.eq(201)
                expect(resPostUser.body.message).to.eq('Cadastro realizado com sucesso')
                expect(resPostUser.body._id).to.not.be.empty

                const id = resPostUser.body._id

                cy.getUserById(id).then((resGetUser) => {
                    expect(resGetUser.body.administrador).to.eq('false')
                })
            })
        })

        it('Deve realizar um cadastro de um administrador', () => {
            const admin = userFactory.generateUser('true')

            cy.postUser(admin).then((resPostUser) => {
                expect(resPostUser.status).to.eq(201)
                expect(resPostUser.body.message).to.eq('Cadastro realizado com sucesso')
                expect(resPostUser.body._id).to.not.be.empty

                const id = resPostUser.body._id

                cy.getUserById(id).then((resGetUser) => {
                    expect(resGetUser.body.administrador).to.eq('true')
                })
            })
        })

        it('Deve consultar um usuário pelo ID', () => {
            cy.postUser(userData).then((resPostUser) => {
                const id = resPostUser.body._id

                cy.getUserById(id).then((resGetUser) => {
                    expect(resGetUser.status).to.eq(200)
                    expect(resGetUser.body.nome).to.eq(userData.nome)
                    expect(resGetUser.body.email).to.eq(userData.email)
                    expect(resGetUser.body._id).to.eq(id)
                })
            })
        })

        it('Deve editar um usuário', () => {
            const userEdit = userFactory.generateUser()

            cy.postUser(userData).then((resPostUser) => {
                const id = resPostUser.body._id

                cy.putUser(id, userEdit).then((resPutUser) => {
                    expect(resPutUser.status).to.eq(200)
                    expect(resPutUser.body.message).to.eq('Registro alterado com sucesso')
                })

                cy.getUserById(id).then((resGetUser) => {
                    expect(resGetUser.body.nome).to.eq(userEdit.nome)
                    expect(resGetUser.body.email).to.eq(userEdit.email)
                })
            })
        })

        it('Deve excluir um usuário', () => {
            cy.postUser(userData).then((resPostUser) => {
                const id = resPostUser.body._id

                cy.deleteUser(id).then((resDeleteUser) => {
                    expect(resDeleteUser.status).to.eq(200)
                    expect(resDeleteUser.body.message).to.eq('Registro excluído com sucesso')
                })

                cy.getUserById(id).then((resGetUser) => {
                    expect(resGetUser.body.message).to.eq('Usuário não encontrado')
                })
            })
        })
    })

    context('Cenários de autorização e erros', () => {
        it('Não deve realizar cadastro com dados em branco', () => {
            const emptyUser = {
                nome: '',
                email: '',
                password: '',
                administrador: ''
            }

            cy.postUser(emptyUser).then((resPostUser) => {
                expect(resPostUser.status).to.eq(400)
                expect(resPostUser.body).to.include(
                    {
                        nome: 'nome não pode ficar em branco',
                        email: 'email não pode ficar em branco',
                        password: 'password não pode ficar em branco',
                        administrador: "administrador deve ser 'true' ou 'false'"
                    }
                )
            })
        })

        it('Não deve realizar cadastro com email inválido', () => {
            const user = {
                nome: 'teste',
                email: 'testegmail.com',
                password: 'pwd123',
                administrador: 'true'
            }

            cy.postUser(user).then((resPostUser) => {
                expect(resPostUser.status).to.eq(400)
                expect(resPostUser.body.email).to.eq('email deve ser um email válido')
            })
        })

        it('Não deve realizar cadastro com email duplicado', () => {
            cy.postUser(userData).then(() => {
                cy.postUser(userData).then((resPostUser) => {
                    expect(resPostUser.status).to.eq(400)
                    expect(resPostUser.body.message).to.eq('Este email já está sendo usado')
                })
            })
        })

        it('Não deve consultar um usuário por ID inexistente', () => {
            cy.getUserById('1234567891011121').then((resGetUser) => {
                expect(resGetUser.status).to.eq(400)
                expect(resGetUser.body.message).to.eq('Usuário não encontrado')
            })
        })

        it('Não deve consultar um usuário por ID inválido', () => {
            cy.getUserById('1').then((resGetUser) => {
                expect(resGetUser.status).to.eq(400)
                expect(resGetUser.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos')
            })
        })

        it('Não deve excluir um usuário com carrinho cadastrado', () => {
            let idProduct
            const admin = userFactory.generateUser('true')

            cy.createUser(admin).then(tokenAdmin => {
                const product = userFactory.generateProduct()

                cy.postProduct(product, tokenAdmin).then(resPostProduct => {
                    idProduct = resPostProduct.body._id
                })
            })

            cy.postUser(userData).then((resPostUser) => {
                const userId = resPostUser.body._id

                cy.postLogin(userData).then((resPostLogin) => {

                    cy.postCart(idProduct, 2, resPostLogin.body.authorization).then(() => {

                        cy.deleteUser(userId).then((resDeleteUser) => {
                            expect(resDeleteUser.status).to.eq(400)
                            expect(resDeleteUser.body.message).to.eq('Não é permitido excluir usuário com carrinho cadastrado')
                        })
                    })
                })
            })
        })
    })
})