const {
  USER,
  USER_ROLE,
  USER_VDABBR,
  TNS_USER,
  ROLE
} = require('../../constants/model');
const table = require('../../constants/table');
const { ADMIN } = require('../../constants/role');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    USER,
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
      tableName: table.USER,
      getterMethods: {
        fullName() {
          return `${this.first_name} ${this.last_name}`;
        },
        isAdmin() {
          return this[ROLE].findIndex(r => r.id === ADMIN.id) > -1;
        }
      }
    }
  );

  User.associate = models => {
    User.belongsToMany(models[ROLE], {
      as: ROLE,
      through: models[USER_ROLE],
      foreignKey: 'userId'
    });
    User.belongsTo(models[TNS_USER], {
      as: TNS_USER,
      constraints: false,
      foreignKey: 'id'
    });
    User.hasMany(models[USER_VDABBR], {
      as: USER_VDABBR,
      foreignKey: 'user_id'
    });
  };
  return User;
};
