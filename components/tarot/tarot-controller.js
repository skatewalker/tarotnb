const models = require('../../models')

module.exports = function () {

    // Función para mezclar un arreglo al azar
    async function shuffleArray(array) {
        return new Promise((resolve, reject) => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            resolve(shuffled)
        })
    }

    async function tiradaTarot(numCards, userId) {
        const tarotCards = await models.card.findAll()
        // Clona y mezcla las cartas originales antes de cada tirada
        const tarotShuffled = await shuffleArray([...tarotCards])
        const user = await models.user.findByPk(userId)

        // Puedes implementar la lógica de la tirada aquí y devolver los resultados como un arreglo JSON
        const shuffled = [];
        for (let i = 0; i < numCards; i++) {
            if (tarotShuffled.length === 0) {
                // No quedan más cartas disponibles, debes manejar esta situación como desees
                console.log("No hay cartas disponibles");
                break;
            }
            const card = tarotShuffled.pop(); // Remueve la carta de la secuencia mezclada
            card.userId = userId
            shuffled.push(card);
        }
        if (user) {
            //const addHistory = await models.shuffling_history.create({userId, shuffled})
            const addHistory = await models.shuffling_history.create({
                userId: userId,
                shuffled: shuffled, // Guarda las cartas mezcladas en el historial
                fecha: new Date()
            });
            return addHistory
        }
        return shuffled
    }

    async function getCards() {
        const cards = await models.card.findAll()
        return cards
    }

    async function getOneCard(id) {
        const tarotCard = await models.card.findByPk(id)
        return  tarotCard
    }

    return {
        tiradaTarot,
        getCards,
        getOneCard
    };
}