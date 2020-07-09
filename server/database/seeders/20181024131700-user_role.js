const _ = require('lodash');

const { USER_ROLE } = require('../../constants/table');
const userRoles = require('../../constants/userRole');
const date = require('../../utils/date');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      USER_ROLE,
      _.map(userRoles, u => ({
        ...u,
        insdttm: date.toDbString(),
        upddttm: date.toDbString()
      }))
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(USER_ROLE, null, {});
  }
};
