const _ = require('lodash');

const db = require('../database/models');
const { FILE_STD, PART } = require('../constants/model');
const date = require('../utils/date');

const FileStd = db[FILE_STD];
const Part = db[PART];
const { Op } = db.Sequelize;

const add = (entry, user) =>
  FileStd.create({
    ...entry,
    insdttm: date.toDbString(),
    upddttm: date.toDbString(),
    insusrid: user.id,
    updusrid: user.id
  });

const getIncludeCriteria = keyword => {
  const joinedPart = {
    model: Part,
    as: PART
  };
  if (!_.isEmpty(keyword)) {
    joinedPart.where = {
      [Op.or]: [
        {
          partnam: {
            [Op.iLike]: `%${keyword}%`
          }
        },
        {
          partno: {
            [Op.iLike]: `%${keyword}%`
          }
        }
      ]
    };
  }
  return joinedPart;
};

const getList = (limit, offset, keyword, sortColumn, sortDirection) => {
  const order =
    sortColumn === 'upddttm'
      ? [[sortColumn, sortDirection]]
      : [[{ model: Part, as: PART }, sortColumn, sortDirection]];
  return FileStd.findAll({
    include: [getIncludeCriteria(keyword)],
    limit,
    offset,
    order
  });
};

const countList = keyword =>
  FileStd.count({ include: [getIncludeCriteria(keyword)] });

const get = id => {
  const include = [
    {
      model: Part,
      as: PART
    }
  ];
  return FileStd.findById(id, { include });
};

const update = ({ partno, file_trouble, file_apprn }, user) =>
  FileStd.update(
    {
      file_trouble,
      file_apprn,
      upddttm: date.toDbString(),
      updusrid: user.id
    },
    { where: { partno } }
  );

const destroy = (partno, transaction) =>
  FileStd.destroy({ where: { partno }, transaction });

const getAll = () => FileStd.findAll();

module.exports = {
  getList,
  countList,
  get,
  add,
  update,
  destroy,
  getAll
};
