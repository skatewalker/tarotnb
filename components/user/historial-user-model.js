const tarotUser = "tarotdb_users";
module.exports = (sequelize, Sequelize) => {
    const shuffling_history = sequelize.define("shuffling_history", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: tarotUser,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        shuffled: {
            type: Sequelize.JSON, // Almacena los detalles de las cartas en formato JSON
            allowNull: false,
        },
        fecha: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Esto establecerá la fecha actual como valor predeterminado
        },
    }, {
        tableName: "tarotdb_shuffling_history_users" // Nombre personalizado de la tabla
     });

     shuffling_history.associate = (models) => {
        shuffling_history.belongsTo(models.user, {
            foreignKey: 'userId',
            targetKey: 'id',
            as: 'user',
        });
    }

    return shuffling_history;
}
