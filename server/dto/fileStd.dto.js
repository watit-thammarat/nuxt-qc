const _ = require('lodash');

const { PART } = require('../constants/model');
const { toTimestamp } = require('../utils/date');
const partDto = require('./part.dto');

const get = e => {
  if (_.isNil(e)) {
    return null;
  }
  return {
    part: partDto.get(e[PART]),
    trouble: e.file_trouble,
    appearance: e.file_apprn,
    updatedAt: toTimestamp(e.upddttm)
  };
};

const getList = entries => {
  if (_.isEmpty(entries)) {
    return null;
  }
  return _.map(entries, get);
};

module.exports = {
  get,
  getList
};
