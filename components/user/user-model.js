module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("user", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.ENUM('subscriber', 'administrator') // o el tipo de datos adecuado para tu caso
        },
        lastLogin: {
            type: Sequelize.DATE
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
          updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: "tarotdb_users" // Nombre personalizado de la tabla
     });

    user.associate = (models) => {
        user.hasMany(models.shuffling_history, {
            foreignKey: 'userId', 
            targetKey: 'id',
            as:'history',
        });
    }

    return user;
}