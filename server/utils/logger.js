const { createLogger, transports, format } = require('winston');
require('winston-daily-rotate-file');

const { env, log } = require('../config');
const { DEV } = require('../constants/env');
const date = require('./date');

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(
  ({ timestamp, level, message }) =>
    `${date.toLogString()} [${level}]: ${message}`
);

const logger = createLogger({
  transports:
    env === DEV
      ? [
          new transports.Console({
            level: 'debug',
            colorize: true
          })
        ]
      : [
          new transports.DailyRotateFile({
            level: 'info',
            filename: `${log.dir}/application-%DATE%.log`,
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
          })
        ],
  format:
    env === DEV
      ? combine(colorize(), timestamp(), logFormat)
      : combine(timestamp(), logFormat)
});

logger.stream = {
  write(message, encoding) {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
};

module.exports = logger;
