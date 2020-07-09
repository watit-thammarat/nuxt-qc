const { FOLLOW_PART, PART, VENDOR, USER } = require('../../constants/model');
const { CREATOR, UPDATER } = require('../../constants/userType');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const FollowPart = sequelize.define(
    FOLLOW_PART,
    {
      partno: {
        allowNull: false,
        type: Sequelize.STRING
      },
      vdcd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vd_invoino: {
        type: Sequelize.STRING,
        allowNull: true
      },
      recvdt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      receives: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      factory: {
        type: Sequelize.STRING,
        allowNull: true
      },
      part_typ: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status_part: {
        type: Sequelize.STRING,
        allowNull: true
      },
      detail_follow: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ipp: {
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
      tableName: table.FOLLOW_PART
    }
  );

  FollowPart.removeAttribute('id');

  FollowPart.associate = models => {
    FollowPart.belongsTo(models[PART], {
      as: PART,
      foreignKey: 'partno',
      constraints: false
    });
    FollowPart.belongsTo(models[VENDOR], {
      as: VENDOR,
      foreignKey: 'vdcd',
      constraints: false
    });
    FollowPart.belongsTo(models[USER], {
      as: CREATOR,
      foreignKey: 'insusrid',
      constraints: false
    });
    FollowPart.belongsTo(models[USER], {
      as: UPDATER,
      foreignKey: 'updusrid',
      constraints: false
    });
  };
  return FollowPart;
};
