Cypress.Commands.add('postUser', (user) => {
    return cy.api({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/usuarios`,
        body: user,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('getUsers', () => {
    return cy.api({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/usuarios`,
        headers: {
            'accept': 'application/json'
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('getUserById', (userId) => {
    return cy.api({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/usuarios/${userId}`,
        headers: {
            'accept': 'application/json'
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('deleteUser', (userId) => {
    return cy.api({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/usuarios/${userId}`,
        headers: {
            'accept': 'application/json'
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('putUser', (userId, user) => {
    return cy.api({
        method: 'PUT',
        url: `${Cypress.env('apiUrl')}/usuarios/${userId}`,
        body: user,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        failOnStatusCode: false
    })
})