module.exports = (sequelize, Sequelize) => {
    const card = sequelize.define("card", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nameCard: {
            type: Sequelize.STRING
        },
        numberCard: {
            type: Sequelize.INTEGER,
        },
        hebreLetterCard: {
            type: Sequelize.STRING
        },
        descriptionCard: {
            type: Sequelize.TEXT
        },
        imageCard:{
            type: Sequelize.STRING
        }
    }, {
        tableName: "tarotdb_cards" // Nombre personalizado de la tabla
     });

    return card;
}