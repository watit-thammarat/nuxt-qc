const db = require('../database/models');

const { RECEIVE_SERIAL } = require('../constants/model');

const ReceiveSerial = db[RECEIVE_SERIAL];

const get = (vdcd, serial) =>
  ReceiveSerial.findOne({ where: { vdcd, serial } });

module.exports = {
  get
};
