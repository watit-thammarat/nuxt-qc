const db = require('../database/models');
const table = require('../constants/table');

const getGroupList = () => {
  const query = `select distinct vdabbr from ${
    table.VENDOR
  } order by vdabbr asc`;
  return db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT });
};

module.exports = {
  getGroupList
};
