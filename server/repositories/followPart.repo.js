const db = require('../database/models');
const { FOLLOW_PART, VENDOR, PART } = require('../constants/model');
const { WAITING } = require('../constants/statusPart');
const { toDbString } = require('../utils/date');

const FollowPart = db[FOLLOW_PART];
const Vendor = db[VENDOR];
const Part = db[PART];

const getTroubleStds = (partno, vdcd, vd_invoino) =>
  FollowPart.findAll({
    where: {
      partno,
      vdcd,
      vd_invoino,
      status_part: WAITING
    }
  });

const getQCMain = (partno, vdcd, vd_invoino) =>
  FollowPart.findOne({
    where: {
      partno,
      vdcd,
      vd_invoino
    },
    include: [
      {
        model: Vendor,
        as: VENDOR
      },
      {
        model: Part,
        as: PART
      }
    ]
  });

const update = (entry, item, user, transaction) =>
  FollowPart.update(
    {
      status_part: item.statusPart,
      ipp: item.ipp || null,
      upddttm: toDbString(),
      updusrid: user
    },
    {
      where: {
        partno: entry.partno,
        vdcd: entry.vdcd,
        vd_invoino: entry.vd_invoino,
        detail_follow: entry.detail_follow
      },
      transaction
    }
  );

module.exports = {
  getQCMain,
  getTroubleStds,
  update
};
