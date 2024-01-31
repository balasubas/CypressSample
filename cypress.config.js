const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl:'https://www.saucedemo.com/',
    testIsolation: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  defaultCommandTimeout: 15000,
  idealPageLoadTime: 2000,
  numTestsKeptInMemory: 0,
  pageLoadTimeout: 180000,
  viewportWidth: 1000,
  viewportHeight: 600,
  requestTimeout: 60000,
  responseTimeout: 60000,
  retries: {
    runMode: 2,
    openMode: 0
  }
});
