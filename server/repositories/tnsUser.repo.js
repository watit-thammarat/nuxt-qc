const db = require('../database/models');
const { TNS_USER } = require('../constants/model');
const table = require('../constants/table');

const TnsUser = db[TNS_USER];

const bulkCreate = (entries, transaction) =>
  TnsUser.bulkCreate(entries, { transaction });

const destroy = transaction => TnsUser.destroy({ truncate: true, transaction });

const getList = () => {
  const query = `
    select * 
    from ${table.TNS_USER} as a
    where not exists (
      select 1
      from ${table.USER} as b
      where a.id = b.id
    )
  `;
  return db.sequelize.query(query, { model: TnsUser });
};

const getById = (id, transaction) => TnsUser.findById(id, { transaction });

module.exports = {
  bulkCreate,
  destroy,
  getList,
  getById
};
