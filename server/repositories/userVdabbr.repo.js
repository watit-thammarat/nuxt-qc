const db = require('../database/models');
const { USER_VDABBR } = require('../constants/model');

const UserVdabbr = db[USER_VDABBR];

const destroyByUserId = (user_id, transaction) =>
  UserVdabbr.destroy({ where: { user_id }, transaction });

const bulkCreate = (entries, transaction) =>
  UserVdabbr.bulkCreate(entries, { transaction });

module.exports = {
  bulkCreate,
  destroyByUserId
};
