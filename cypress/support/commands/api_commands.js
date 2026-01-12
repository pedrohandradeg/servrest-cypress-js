Cypress.Commands.add('createUser', (user) => {
  return cy.postUser(user).then(() => {
    return cy.postLogin(user).then(res => res.body.authorization)
  })
})