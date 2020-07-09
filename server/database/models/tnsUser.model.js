const { TNS_USER, USER } = require('../../constants/model');
const table = require('../../constants/table');

module.exports = (sequelize, Sequelize) => {
  const TnsUser = sequelize.define(
    TNS_USER,
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gid: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      uid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
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
      tableName: table.TNS_USER,
      getterMethods: {
        fullName() {
          return `${this.first_name} ${this.last_name}`;
        }
      }
    }
  );

  TnsUser.associate = models => {
    TnsUser.hasOne(models[USER], {
      as: USER,
      constraints: false,
      foreignKey: 'id'
    });
  };
  return TnsUser;
};
