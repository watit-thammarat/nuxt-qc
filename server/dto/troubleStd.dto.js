const _ = require('lodash');

const partTypes = require('../constants/partType');
const { toTimestamp } = require('../utils/date');

const get = e => {
  if (_.isNil(e)) {
    return null;
  }
  return {
    partType: _.find(partTypes, p => p.id === e.part_typ),
    statusPart: e.status_part,
    detailFollow: e.detail_follow,
    ipp: e.ipp,
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
