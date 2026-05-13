// @ts-check
import { defineConfig, devices } from '@playwright/test';

module.exports = defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    baseURL: 'https://api.escuelajs.co/api/v1/',
  },
});

