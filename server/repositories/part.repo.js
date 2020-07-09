const db = require('../database/models');
const { PART } = require('../constants/model');
const table = require('../constants/table');

const Part = db[PART];

const getList = () => {
  const query = `
    select * 
    from ${table.PART} as a
    where not exists (
      select 1
      from ${table.FILE_STD} as b
      where a.partno = b.partno
    ) and a.kind_goods in ('2', '3')
  `;
  return db.sequelize.query(query, { model: Part });
};

module.exports = {
  getList
};
