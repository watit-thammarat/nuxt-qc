const { ROLE, USER_ROLE, USER } = require('../../constants/model');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    ROLE,
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
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
      tableName: table.ROLE
    }
  );
  Role.associate = models => {
    Role.belongsToMany(models[USER], {
      as: USER,
      through: models[USER_ROLE],
      foreignKey: 'roleId'
    });
  };
  return Role;
};
