const { VENDOR, USER_VDABBR } = require('../../constants/model');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const Vendor = sequelize.define(
    VENDOR,
    {
      vdcd: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      vdnam: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vdabbr: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vdadd1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vdadd2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tel: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fax: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vd_attnnam: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vd_attnpos_cd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tnsfr_nam: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vdtyp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      acvdtyp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country_cd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dutytyp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      currency_cd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      incoterms_cd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      paytcd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      viacd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lt_sea_etd: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lt_sea_eta: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lt_sea_eti: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lt_air_etd: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lt_air_eta: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lt_air_eti: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      po_confirm_dt: {
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
      }
    },
    {
      tableName: table.VENDOR
    }
  );
  Vendor.associate = models => {
    Vendor.hasMany(models[USER_VDABBR], {
      as: USER_VDABBR,
      constraints: false,
      foreignKey: 'vdabbr'
    });
  };
  return Vendor;
};
