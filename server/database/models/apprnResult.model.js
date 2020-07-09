const { APPRN_RESULT, PART, USER } = require('../../constants/model');
const { CREATOR, UPDATER } = require('../../constants/userType');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const ApprnResult = sequelize.define(
    APPRN_RESULT,
    {
      vd_invoino: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
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
      recv_dt: { type: Sequelize.STRING, allowNull: true },
      detail: { type: Sequelize.STRING, allowNull: true },
      checked: { type: Sequelize.STRING, allowNull: false },
      pass: { type: Sequelize.STRING, allowNull: false },
      insdttm: { type: Sequelize.STRING, allowNull: true },
      upddttm: { type: Sequelize.STRING, allowNull: true },
      insprgid: { type: Sequelize.STRING, allowNull: true },
      updprgid: { type: Sequelize.STRING, allowNull: true },
      insusrid: { type: Sequelize.STRING, allowNull: true },
      updusrid: { type: Sequelize.STRING, allowNull: true }
    },
    { tableName: table.APPRN_RESULT }
  );
  ApprnResult.associate = models => {
    ApprnResult.belongsTo(models[PART], {
      as: PART,
      foreignKey: 'partno',
      constraints: false
    });
    ApprnResult.belongsTo(models[USER], {
      as: CREATOR,
      foreignKey: 'insusrid',
      constraints: false
    });
    ApprnResult.belongsTo(models[USER], {
      as: UPDATER,
      foreignKey: 'updusrid',
      constraints: false
    });
  };
  return ApprnResult;
};
