const _ = require('lodash');

const get = e => {
  if (_.isNil(e)) {
    return null;
  }
  return {
    id: e.vdcd,
    name: e.vdnam
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
