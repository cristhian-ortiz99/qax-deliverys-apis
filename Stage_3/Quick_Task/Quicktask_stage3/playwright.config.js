// @ts-check
import { defineConfig, devices } from '@playwright/test';
require("dotenv").config();

module.exports = {
  use: {
    baseURL: process.env.BASE_URL,
  },
};
