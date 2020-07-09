const path = require('path');

const { DEV } = require('../constants/env');

const env = process.env.NODE_ENV || DEV;

module.exports = {
  env,
  isDev: env === DEV,
  port: {
    http: process.env.HTTP_PORT,
    https: process.env.HTTPS_PORT
  },
  log: {
    dir: path.resolve(__dirname, '../logs')
  },
  file: {
    dir: path.resolve(__dirname, '../upload'),
    size: 4 * 1024 * 1024,
    mimetype: {
      image: ['image/jpeg', 'image/png'],
      pdf: ['application/pdf']
    }
  },
  ldap: {
    url: process.env.LDAP_URL
  },
  jwt: {
    secretOrKey: process.env.JWT_SECRET_KEY
  }
};
