import { faker } from '@faker-js/faker'

export const userFactory = {
  generateUser: (isAdmin = 'false') => {
    return {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'teste1234',
      administrador: isAdmin
    }
  },

  generateProduct: () => {
    return {
      nome: faker.commerce.productName(),
      preco: faker.number.int({ min: 10, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 10, max: 500 })
    }
  }
}