// @ts-check
import { defineConfig, devices } from '@playwright/test';

module.exports = defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    // Definimos la Base URL de la API de Notes
    baseURL: 'https://demoqa.com/',
  },
});

