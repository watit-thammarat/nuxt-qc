const { USER, ROLE, USER_ROLE } = require('../../constants/table');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(USER_ROLE, {
      userId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: USER,
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      roleId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: ROLE,
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      insdttm: {
        type: Sequelize.STRING,
        allowNull: false
      },
      upddttm: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(USER_ROLE);
  }
};
