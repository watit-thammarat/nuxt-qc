require('dotenv-flow').config();

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
};

module.exports = {
  development: {
    ...common,
    dialect: 'postgres',
    logging: console.log
  },
  beta: {
    ...common,
    dialect: 'postgres',
    logging: false
  },
  production: {
    ...common,
    dialect: 'postgres',
    logging: false
  }
};
