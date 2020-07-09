const _ = require('lodash');

const { toTimestamp } = require('../utils/date');

const get = e => {
  if (_.isNil(e)) {
    return null;
  }
  return {
    id: e.id,
    gid: e.gid,
    uid: e.uid,
    firstName: e.first_name,
    lastName: e.last_name,
    fullName: e.fullName,
    email: e.email,
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
