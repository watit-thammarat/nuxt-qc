const db = require('../database/models');
const { QC_PART } = require('../constants/model');
const { toDbString, toDbDateString } = require('../utils/date');

const QcPart = db[QC_PART];

const update = (entry, updusrid, transaction) =>
  QcPart.update(
    {
      availdte: toDbDateString(),
      upddttm: toDbString(),
      updusrid
    },
    {
      where: {
        partno: entry.partno,
        part_typ: entry.part_typ,
        detail_follow: entry.detail_follow
      },
      transaction
    }
  );

module.exports = {
  update
};
