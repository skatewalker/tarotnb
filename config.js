/* Config file - Set a object with all enviroments. */
const config = {
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASS || '1320Xfdrappdb*',
        database: process.env.MYSQL_DB || 'tarot_db',
        dialect: process.env.MYSQL_DIALECT ||  "mysql",
	  port: process.env.MYSQL_PORT || 3306,
        pool: {
            max: process.env.MYSQL_MAX ||  5,
            min: process.env.MYSQL_MIN ||  0,
            acquire: process.env.MYSQL_ACQUIRE || 30000,
            idle: process.env.MYSQL_IDLE || 10000
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET || '1320tarot*jwt'
    },
}

//Export config object
module.exports = config;
