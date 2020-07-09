const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const { DEV } = require('../../constants/env');
const basename = path.basename(__filename);
const { env } = require('../../config');
const config = require('../../config/database')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    define: {
      timestamps: false,
      freezeTableName: true
    }
  }
);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.lastIndexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
