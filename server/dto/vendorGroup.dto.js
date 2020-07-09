const _ = require('lodash');

const get = e => {
  if (_.isNil(e)) {
    return null;
  }
  return { name: e.vdabbr };
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
