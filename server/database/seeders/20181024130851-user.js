const _ = require('lodash');

const { USER } = require('../../constants/table');
const users = require('../../constants/user');
const date = require('../../utils/date');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      USER,
      _.map(users, u => ({
        ...u,
        insdttm: date.toDbString(),
        upddttm: date.toDbString()
      }))
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(USER, null, {});
  }
};
