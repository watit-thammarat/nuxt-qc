const _ = require('lodash');

const db = require('../database/models');
const { APPRN_STD, PART } = require('../constants/model');
const date = require('../utils/date');

const ApprnStd = db[APPRN_STD];
const Part = db[PART];

const include = [
  {
    model: Part,
    as: PART
  }
];

const getMaxItemNo = (partno, transaction) =>
  ApprnStd.max('item_no', { where: { partno }, transaction });

const add = (entry, user, transaction) =>
  ApprnStd.create(
    {
      ...entry,
      insdttm: date.toDbString(),
      upddttm: date.toDbString(),
      insusrid: user.id,
      updusrid: user.id
    },
    { transaction }
  );

const update = ({ partno, item_no, detail, picture }, user) =>
  ApprnStd.update(
    {
      detail,
      picture,
      upddttm: date.toDbString(),
      updusrid: user.id
    },
    { where: { partno, item_no } }
  );

const get = (partno, item_no) =>
  ApprnStd.findOne({ where: { partno, item_no }, include });

const getListByParyNo = partno =>
  ApprnStd.findAll({ where: { partno }, include, order: [['item_no', 'asc']] });

const destroy = (partno, item_no) =>
  ApprnStd.destroy({ where: { partno, item_no } });

const destroyByPartNo = (partno, transaction) =>
  ApprnStd.destroy({ where: { partno }, transaction });

const getAll = () => ApprnStd.findAll();

module.exports = {
  getMaxItemNo,
  update,
  add,
  get,
  getListByParyNo,
  destroy,
  destroyByPartNo,
  getAll
};
