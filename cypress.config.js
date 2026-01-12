const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://front.serverest.dev',
    viewportWidth: 1440,
    viewportHeight: 900,

    env: {
      apiUrl: 'https://serverest.dev'
    }
  },
})
