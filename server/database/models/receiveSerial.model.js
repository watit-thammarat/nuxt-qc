const { RECEIVE_SERIAL, PART, VENDOR, USER } = require('../../constants/model');
const { CREATOR, UPDATER } = require('../../constants/userType');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const ReceiveSerial = sequelize.define(
    RECEIVE_SERIAL,
    {
      vdcd: {
        allowNull: false,
        type: Sequelize.STRING,
        autoIncrement: false,
        primaryKey: true
      },
      serial: {
        type: Sequelize.STRING,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true
      },
      ds_sheetno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vd_invoino: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deli_date: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      partno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vd_lotno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      recv_qty: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      remain_qty: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      resv_qty: {
        type: Sequelize.INTEGER,
        allowNull: false
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
      tableName: table.RECEIVE_SERIAL
    }
  );
  ReceiveSerial.associate = models => {
    ReceiveSerial.belongsTo(models[VENDOR], {
      as: VENDOR,
      foreignKey: 'vdcd',
      constraints: false
    });
    ReceiveSerial.belongsTo(models[PART], {
      as: PART,
      foreignKey: 'partno',
      constraints: false
    });
    ReceiveSerial.belongsTo(models[USER], {
      as: CREATOR,
      foreignKey: 'insusrid',
      constraints: false
    });
    ReceiveSerial.belongsTo(models[USER], {
      as: UPDATER,
      foreignKey: 'updusrid',
      constraints: false
    });
  };
  return ReceiveSerial;
};
