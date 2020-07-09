const _ = require('lodash');

const { toTimestamp } = require('../utils/date');

const get = e => {
  if (_.isNil(e)) {
    return null;
  }
  return {
    id: e.partno,
    name: e.partnam,
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
