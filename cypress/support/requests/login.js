Cypress.Commands.add('postLogin', (user) => {
    return cy.api({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`,
        body: {
            email: user.email,
            password: user.password,
        },
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        failOnStatusCode: false
    })
})