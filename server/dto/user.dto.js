const _ = require('lodash');
const qrcode = require('qrcode');

const role = require('./role.dto');
const vendorGroups = require('./vendorGroup.dto');
const { ROLE, USER_VDABBR } = require('../constants/model');
const { toTimestamp } = require('../utils/date');

const get = async e => {
  if (_.isNil(e)) {
    return null;
  }
  const qr = await qrcode.toDataURL(e.uid);
  return {
    id: e.id,
    gid: e.gid,
    uid: e.uid,
    firstName: e.first_name,
    lastName: e.last_name,
    fullName: e.fullName,
    email: e.email,
    qr,
    roles: role.getList(e[ROLE]),
    vendorGroups: vendorGroups.getList(e[USER_VDABBR]),
    updatedAt: toTimestamp(e.upddttm)
  };
};

const getList = async entries => {
  if (_.isEmpty(entries)) {
    return null;
  }
  const items = [];
  for (const e of entries) {
    const item = await get(e);
    items.push(item);
  }
  return items;
};

module.exports = {
  get,
  getList
};
