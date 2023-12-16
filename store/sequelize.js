const {Sequelize} = require('sequelize');
const config = require('../config');

//Dbase configuration in a object
const dbconf = {
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
}

// Configura la conexión a la base de datos
const sequelize = new Sequelize(dbconf, {
  host: dbconf.host,
  port: dbconf.port,
  user: dbconf.user,
  password: dbconf.password,
  database: dbconf.database,
  dialect: 'mysql',
  // Otros parámetros de configuración
});

module.exports = sequelize;
