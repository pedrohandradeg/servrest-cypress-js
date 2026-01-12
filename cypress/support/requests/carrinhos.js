Cypress.Commands.add('getCarts',  () => {
    return cy.api({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/carrinhos`,
        headers: {
            'accept': 'application/json'
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('getCartById',  (idCart) => {
    return cy.api({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/carrinhos/${idCart}`,
        headers: {
            'accept': 'application/json'
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('postCart', (idProduct, quantidade, token) => {
    return cy.api({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/carrinhos`,
        body: {
            produtos : [
                {
                    idProduto: idProduct,
                    quantidade: quantidade
                }
            ]
        },
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('deleteCompletePurchase', (token) => {
    return cy.api({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/carrinhos/concluir-compra`,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('deleteCancelPurchase', (token) => {
    return cy.api({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/carrinhos/cancelar-compra`,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        failOnStatusCode: false
    })
})