require('dotenv-flow').config();

const express = require('express');
const fs = require('fs-extra');
const { Nuxt, Builder } = require('nuxt');
const https = require('https');
const http = require('http');
const path = require('path');

const { port, file, isDev } = require('./config');
const { sequelize } = require('./database/models');
const tnsUserService = require('./services/tnsUser.service');
const cron = require('./cron');
const controller = require('./controllers');
const middleware = require('./middlewares');
const logger = require('./utils/logger');
const config = require('../nuxt.config.js');

const app = express();

const configureNuxt = async () => {
  config.dev = isDev;
  const nuxt = new Nuxt(config);
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }
  app.use(nuxt.render);
};

const configureCron = async () => {
  await tnsUserService.configure();
  cron.configure();
};

const configureAPI = async () => {
  await fs.ensureDir(file.dir);
  await sequelize.sync({ force: false });
  middleware.configure(app);
  controller.configure(app);
  middleware.configureError(app);
};

const serve = () => {
  const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem'))
  };
  https
    .createServer(options, app)
    .listen(port.https, () =>
      console.log(`HTTPS Server started at port ${port.https}`)
    );
  http
    .createServer(app)
    .listen(port.http, () =>
      console.log(`HTTP Server started at port ${port.http}`)
    );
};

const start = async () => {
  try {
    await configureCron();
    await configureAPI();
    await configureNuxt();
    serve();
  } catch (err) {
    logger.error(err.stack);
    process.exit(-1);
  }
};

start();
