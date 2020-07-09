const { USER_VDABBR, USER } = require('../../constants/table');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(USER_VDABBR, {
      user_id: {
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
      vdabbr: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
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
    return queryInterface.dropTable(USER_VDABBR);
  }
};
