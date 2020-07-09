const { APPRN_STD, PART, USER } = require('../../constants/model');
const { CREATOR, UPDATER } = require('../../constants/userType');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const ApprnStd = sequelize.define(
    APPRN_STD,
    {
      partno: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      item_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
      },
      detail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      picture: {
        type: Sequelize.STRING,
        allowNull: false
      },
      active_flg: {
        type: Sequelize.STRING,
        allowNull: true
      },
      insdttm: {
        type: Sequelize.STRING,
        allowNull: true
      },
      upddttm: {
        type: Sequelize.STRING,
        allowNull: true
      },
      insprgid: {
        type: Sequelize.STRING,
        allowNull: true
      },
      updprgid: {
        type: Sequelize.STRING,
        allowNull: true
      },
      insusrid: {
        type: Sequelize.STRING,
        allowNull: true
      },
      updusrid: {
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    {
      tableName: table.APPRN_STD
    }
  );
  ApprnStd.associate = models => {
    ApprnStd.belongsTo(models[PART], {
      as: PART,
      foreignKey: 'partno',
      constraints: false
    });
    ApprnStd.belongsTo(models[USER], {
      as: CREATOR,
      foreignKey: 'insusrid',
      constraints: false
    });
    ApprnStd.belongsTo(models[USER], {
      as: UPDATER,
      foreignKey: 'updusrid',
      constraints: false
    });
  };
  return ApprnStd;
};
