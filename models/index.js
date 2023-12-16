const config = require("../config.js");
const Sequelize = require("sequelize");

//Dbase configuration in a object
const dbconf = {
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
}

const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
  host: config.mysql.host,
  dialect: config.mysql.dialect,
  //operatorsAliases: false,

  pool: {
    max: config.mysql.pool.max,
    min: config.mysql.pool.min,
    acquire: config.mysql.pool.acquire,
    idle: config.mysql.pool.idle
  }
});

//Object model empty
const models = {};

models.Sequelize = Sequelize
models.sequelize = sequelize

//set & import models
models.user = require("../components/user/user-model.js")(sequelize, Sequelize);
models.card = require("../components/tarot/card-model.js")(sequelize, Sequelize);
models.shuffling_history = require("../components/user/historial-user-model.js")(sequelize, Sequelize);

// Activa las asociaciones
for (let modelName in models) {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
}

module.exports = models;