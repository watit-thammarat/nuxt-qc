const { SAMPLING, USER } = require('../../constants/model');
const { CREATOR, UPDATER } = require('../../constants/userType');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const Sampling = sequelize.define(
    SAMPLING,
    {
      sampling_typ: {
        allowNull: false,
        type: Sequelize.STRING,
        autoIncrement: false,
        primaryKey: true
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true
      },
      lotsize_fr: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lotsize_to: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sampling_size: {
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
      tableName: table.SAMPLING
    }
  );
  Sampling.associate = models => {
    Sampling.belongsTo(models[USER], {
      as: CREATOR,
      foreignKey: 'insusrid',
      constraints: false
    });
    Sampling.belongsTo(models[USER], {
      as: UPDATER,
      foreignKey: 'updusrid',
      constraints: false
    });
  };
  return Sampling;
};
