const _ = require('lodash');

const db = require('../database/models');
const { SAMPLING } = require('../constants/model');
const { toDbString } = require('../utils/date');

const Sampling = db[SAMPLING];
const { Op } = db.Sequelize;

const getByLotSize = lotSize =>
  Sampling.findAll({
    where: {
      lotsize_fr: {
        [Op.lte]: lotSize
      },
      lotsize_to: {
        [Op.gte]: lotSize
      }
    }
  });

const getListCriteria = keyword => {
  const where = {};
  if (!_.isEmpty(keyword)) {
    where.where = {
      [Op.or]: [
        {
          sampling_typ: {
            [Op.iLike]: `%${keyword}%`
          }
        },
        {
          level: {
            [Op.iLike]: `%${keyword}%`
          }
        }
      ]
    };
  }
  return where;
};

const getList = (keyword, limit, offset, sortColumn, sortDirection) =>
  Sampling.findAll({
    ...getListCriteria(keyword),
    limit,
    offset,
    order: [[sortColumn, sortDirection]]
  });

const countList = keyword => Sampling.count({ ...getListCriteria(keyword) });

const get = (sampling_typ, level) =>
  Sampling.findOne({ where: { sampling_typ, level } });

const add = (
  sampling_typ,
  level,
  lotsize_fr,
  lotsize_to,
  sampling_size,
  userId
) =>
  Sampling.create({
    sampling_typ,
    level,
    lotsize_fr,
    lotsize_to,
    sampling_size,
    insdttm: toDbString(),
    upddttm: toDbString(),
    insusrid: userId,
    updusrid: userId
  });

const update = (
  sampling_typ,
  level,
  lotsize_fr,
  lotsize_to,
  sampling_size,
  userId
) =>
  Sampling.update(
    {
      lotsize_fr,
      lotsize_to,
      sampling_size,
      upddttm: toDbString(),
      updusrid: userId
    },
    {
      where: { sampling_typ, level }
    }
  );

const destroy = (sampling_typ, level) =>
  Sampling.destroy({ where: { sampling_typ, level } });

module.exports = {
  getByLotSize,
  getList,
  countList,
  get,
  add,
  update,
  destroy
};
