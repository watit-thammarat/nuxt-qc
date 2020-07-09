const db = require('../database/models');
const { APPRN_RESULT } = require('../constants/model');
const { toDbDateString, toDbString } = require('../utils/date');

const ApprnResult = db[APPRN_RESULT];

const save = (vd_invoino, entry, checked, user, pass, transaction) =>
  ApprnResult.upsert(
    {
      vd_invoino,
      partno: entry.partno,
      item_no: entry.item_no,
      recv_dt: toDbDateString(),
      detail: entry.detail,
      checked,
      pass,
      insdttm: toDbString(),
      upddttm: toDbString(),
      insusrid: user,
      updusrid: user
    },
    { transaction }
  );

module.exports = {
  save
};
