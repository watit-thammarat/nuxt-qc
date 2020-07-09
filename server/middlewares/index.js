const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const compression = require('compression');

const jwt = require('./jwt');
const { file } = require('../config');
const { NOT_FOUND } = require('../utils/errors');
const logger = require('../utils/logger');

const configure = async app => {
  app.use(morgan('tiny', { stream: logger.stream }));
  app.use(cors());
  app.use(compression());
  app.use('/files', express.static(file.dir));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(passport.initialize());
  jwt.configure(passport);
};

const configureError = app =>
  app.use((err, req, res, next) => {
    let status = 500;
    let message = 'Internal server error';
    if (err.status) {
      status = err.status;
      message = err.message;
    } else {
      logger.error(err.stack);
    }
    res.status(status).json({ message });
  });

const configureNotFound = app => app.use((req, res, next) => next(NOT_FOUND));

module.exports = {
  configure,
  configureError,
  configureNotFound
};
