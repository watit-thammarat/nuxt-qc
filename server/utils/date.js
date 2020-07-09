const moment = require('moment');
const _ = require('lodash');

const DB_DATE_TIME_FORMAT = 'YYYYMMDDHHmmss';
const DB_DATE_FORMAT = 'YYYYMMDD';
const LOG_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

const toDbString = () => moment().format(DB_DATE_TIME_FORMAT);

const toDbDateString = () => moment().format(DB_DATE_FORMAT);

const toLogString = () => moment().format(LOG_DATE_TIME_FORMAT);

const toTimestamp = value =>
  _.isEmpty(value) ? null : moment(value, DB_DATE_TIME_FORMAT).unix();

module.exports = {
  toDbString,
  toTimestamp,
  toDbDateString,
  toLogString
};
