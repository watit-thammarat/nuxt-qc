const _ = require('lodash');

const { toTimestamp } = require('../utils/date');

const get = e => {
  if (_.isNil(e)) {
    return null;
  }
  return {
    type: e.sampling_typ,
    level: e.level,
    from: +e.lotsize_fr,
    to: +e.lotsize_to,
    size: +e.sampling_size,
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
