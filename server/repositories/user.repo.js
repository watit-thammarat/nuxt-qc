const _ = require('lodash');

const db = require('../database/models');
const { USER } = require('../constants/model');
const date = require('../utils/date');
const { ROLE, USER_VDABBR } = require('../constants/model');

const { Op } = db.Sequelize;
const User = db[USER];
const Role = db[ROLE];
const UserVdabbr = db[USER_VDABBR];

const include = [
  {
    model: Role,
    as: ROLE
  },
  {
    model: UserVdabbr,
    as: USER_VDABBR
  }
];

const add = (entry, transaction) =>
  User.create(
    {
      ...entry.get({ plain: true }),
      insdttm: date.toDbString(),
      upddttm: date.toDbString()
    },
    { transaction }
  );

const getByIdWithRelation = id => User.findById(id, { include });

const getById = (id, t) => {
  const opts = {};
  if (t) {
    opts.transaction = t;
  }
  return User.findById(id, opts);
};

const destroy = id => User.destroy({ where: { id } });

const getListCriteria = keyword => {
  const where = {};
  if (!_.isEmpty(keyword)) {
    where.where = {
      [Op.or]: [
        {
          first_name: {
            [Op.iLike]: `%${keyword}%`
          }
        },
        {
          last_name: {
            [Op.iLike]: `%${keyword}%`
          }
        }
      ]
    };
  }
  return where;
};

const getList = (limit, offset, keyword, sortColumn, sortDirection) =>
  User.findAll({
    ...getListCriteria(keyword),
    include,
    limit,
    offset,
    order: [[sortColumn, sortDirection]]
  });

const countList = keyword => User.count({ ...getListCriteria(keyword) });

module.exports = {
  add,
  getById,
  getByIdWithRelation,
  destroy,
  getList,
  countList
};
