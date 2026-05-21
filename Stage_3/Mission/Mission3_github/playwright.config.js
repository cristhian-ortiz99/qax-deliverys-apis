const env = process.env.ENV || 'dev';

require('dotenv').config({ path: `.env.${env}` });

module.exports = {
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    timeout: parseInt(process.env.API_TIMEOUT) || 5000,
  },
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
};
