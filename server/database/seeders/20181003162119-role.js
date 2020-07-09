const _ = require('lodash');

const { ROLE } = require('../../constants/table');
const role = require('../../constants/role');
const date = require('../../utils/date');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      ROLE,
      _.chain(role)
        .values()
        .map(v => ({
          ...v,
          insdttm: date.toDbString(),
          upddttm: date.toDbString()
        }))
        .value()
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(ROLE, null, {});
  }
};
