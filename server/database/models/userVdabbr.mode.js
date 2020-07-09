const { USER, USER_VDABBR, VENDOR } = require('../../constants/model');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const UserVdabbr = sequelize.define(
    USER_VDABBR,
    {
      user_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vdabbr: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      insdttm: { type: Sequelize.STRING, allowNull: false },
      upddttm: { type: Sequelize.STRING, allowNull: false }
    },
    {
      tableName: table.USER_VDABBR
    }
  );

  UserVdabbr.associate = models => {
    UserVdabbr.belongsTo(models[USER], { as: USER, foreignKey: 'user_id' });
    UserVdabbr.belongsTo(models[VENDOR], {
      as: VENDOR,
      constraints: false,
      foreignKey: 'vdabbr'
    });
  };

  return UserVdabbr;
};
