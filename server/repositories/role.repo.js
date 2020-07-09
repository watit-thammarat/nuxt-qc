const db = require('../database/models');
const { ROLE } = require('../constants/model');

const Role = db[ROLE];
const { Op } = db.Sequelize;

const getList = () => Role.findAll();

const getByIds = (ids, transaction) =>
  Role.findAll({
    where: {
      id: {
        [Op.in]: ids
      }
    },
    transaction
  });

module.exports = {
  getList,
  getByIds
};
