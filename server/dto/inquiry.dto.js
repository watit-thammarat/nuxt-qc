const _ = require('lodash');

const { toTimestamp } = require('../utils/date');
const partDto = require('../dto/part.dto');
const vendorDto = require('../dto/vendor.dto');

const get = e => {
  if (_.isNil(e)) {
    return null;
  }
  return {
    vendor: vendorDto.get(e),
    part: partDto.get(e),
    model: e.model,
    qty: _.isNil(e.qty) || !_.isNumber(+e.qty) ? null : +e.qty,
    detailFollow: e.detail_follow,
    date: toTimestamp(e.date),
    statusPart: e.status_part,
    invoice: e.invoice_no,
    location: e.location
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
