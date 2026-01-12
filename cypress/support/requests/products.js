Cypress.Commands.add('postProduct', (product, token) => {
    return cy.api({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/produtos`,
        body: product,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json', 
            'Authorization': token
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('getProducts', () => {
    return cy.api({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/produtos`,
        headers: {
            'accept': 'application/json'
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('getProductById', (idProduct) => {
    return cy.api({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/produtos/${idProduct}`,
        headers: {
            'accept': 'application/json'
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('deleteProduct', (idProduct, token) => {
    return cy.api({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/produtos/${idProduct}`,
        headers: {
            'accept': 'application/json',
            'Authorization': token
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('putProduct', (idProduct, product, token) => {
    return cy.api({
        method: 'PUT',
        url: `${Cypress.env('apiUrl')}/produtos/${idProduct}`,
        body: product,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': token
        },
        failOnStatusCode: false
    })
})