const { PART, FILE_STD, APPRN_STD } = require('../../constants/model');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const Part = sequelize.define(
    PART,
    {
      partno: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      partnam: {
        type: Sequelize.STRING,
        allowNull: true
      },
      kind_goods: {
        type: Sequelize.STRING,
        allowNull: true
      },
      model: {
        type: Sequelize.STRING,
        allowNull: true
      },
      unitcd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      prodtyp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      picktyp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pickdays: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      acpart_typ: {
        type: Sequelize.STRING,
        allowNull: true
      },
      stkclkcd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ledtyp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mainledno: {
        type: Sequelize.STRING,
        allowNull: true
      },
      whtyp_in: {
        type: Sequelize.STRING,
        allowNull: false
      },
      whcd_in: {
        type: Sequelize.STRING,
        allowNull: false
      },
      whtyp_out: {
        type: Sequelize.STRING,
        allowNull: false
      },
      whcd_out: {
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
      tableName: table.PART
    }
  );

  Part.associate = models => {
    Part.hasOne(models[FILE_STD], {
      as: FILE_STD,
      foreignKey: 'partno',
      constraints: false
    });
    Part.hasOne(models[APPRN_STD], {
      as: APPRN_STD,
      foreignKey: 'partno',
      constraints: false
    });
  };

  return Part;
};
