const { USER_ROLE } = require('../../constants/model');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define(
    USER_ROLE,
    {
      insdttm: {
        type: Sequelize.STRING,
        allowNull: false
      },
      upddttm: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      tableName: table.USER_ROLE
    }
  );
  return UserRole;
};
