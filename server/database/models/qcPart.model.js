const { QC_PART, PART, VENDOR, USER } = require('../../constants/model');
const { CREATOR, UPDATER } = require('../../constants/userType');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const QcPart = sequelize.define(
    QC_PART,
    {
      partno: {
        allowNull: false,
        type: Sequelize.STRING,
        autoIncrement: false,
        primaryKey: true
      },
      part_typ: {
        type: Sequelize.STRING,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true
      },
      detail_follow: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true
      },
      vdcd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      availdts: {
        type: Sequelize.STRING,
        allowNull: false
      },
      availdte: {
        type: Sequelize.STRING,
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
      tableName: table.QC_PART
    }
  );

  QcPart.removeAttribute('id');

  QcPart.associate = models => {
    QcPart.belongsTo(models[PART], {
      as: PART,
      foreignKey: 'partno',
      constraints: false
    });
    QcPart.belongsTo(models[VENDOR], {
      as: VENDOR,
      foreignKey: 'vdcd',
      constraints: false
    });
    QcPart.belongsTo(models[USER], {
      as: CREATOR,
      foreignKey: 'insusrid',
      constraints: false
    });
    QcPart.belongsTo(models[USER], {
      as: UPDATER,
      foreignKey: 'updusrid',
      constraints: false
    });
  };
  return QcPart;
};
