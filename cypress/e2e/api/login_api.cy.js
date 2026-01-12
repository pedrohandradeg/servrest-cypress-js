import { userFactory } from '../../support/factories/userFactory'

describe('Fluxo de login - API', () => {

  const validateSuccessfulLogin = (response) => {
    expect(response.status).to.eq(200)
    expect(response.body.message).to.eq('Login realizado com sucesso')
    expect(response.body).to.have.property('authorization').and.not.be.empty
  }

  context('Cenários de sucesso', () => {
    it('Deve realizar login como usuário comum', () => {
      const user = userFactory.generateUser()

      cy.postUser(user).then(() => {
        cy.postLogin(user).then(validateSuccessfulLogin)
      })
    })

    it('Deve realizar login como administrador', () => {
      const admin = userFactory.generateUser('true')

      cy.postUser(admin).then(() => {
        cy.postLogin(admin).then(validateSuccessfulLogin)
      })
    })
  })

  context('Cenários de erros', () => {
    it('Não deve realizar login com usuário inexistente', () => {
      const user = {
        email: 'galomirofulano@gmail.com',
        password: 'pwd123',
      }

      cy.postLogin(user).then((resPostLogin) => {
        expect(resPostLogin.status).to.eq(401)
        expect(resPostLogin.body.message).to.eq('Email e/ou senha inválidos')
      })
    })

    it('Não deve realizar login com email inválido', () => {
      const user = {
        email: 'galomirofulanogmail.com',
        password: 'pwd123',
      }

      cy.postLogin(user).then((resPostLogin) => {
        expect(resPostLogin.status).to.eq(400)
        expect(resPostLogin.body.email).to.eq('email deve ser um email válido')
      })
    })

    it('Não deve realizar login com campos vazios', () => {
      const user = {
        email: '',
        password: '',
      }

      cy.postLogin(user).then((resPostLogin) => {
        expect(resPostLogin.status).to.eq(400)
        expect(resPostLogin.body).to.include(
          {
            email: 'email não pode ficar em branco',
            password: 'password não pode ficar em branco'
          }
        )
      })
    })
  })
})