// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    // Definimos la Base URL de la API de Notes
    baseURL: 'https://practice.expandtesting.com/notes/api/',
  },
});

