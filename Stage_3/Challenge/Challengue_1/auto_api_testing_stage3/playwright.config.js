require('dotenv').config();

module.exports = {
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  reporter: [['html', { open: 'never' }]],
};