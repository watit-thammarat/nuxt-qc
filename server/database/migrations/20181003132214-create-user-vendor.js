const { USER_VENDOR, VENDOR, USER } = require('../../constants/table');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(USER_VENDOR, {
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
      vendorId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
        references: {
          model: VENDOR,
          key: 'vdcd'
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
    return queryInterface.dropTable(USER_VENDOR);
  }
};
