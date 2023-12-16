const express = require('express');
const router = express.Router();
const response = require('../../network/response');
const tarotController = require('./index');
const passport = require ('passport');

router.post('/tirada',   passport.authenticate('jwt', {session:false}), tiradaTarot)
router.get('/cards', getCards)
router.get('/cards/:id', getOneCard)

function tiradaTarot(req, res, next) {
    const numCards = req.body.numCards
    const userId = req.user.sub; 
    tarotController.tiradaTarot(numCards, userId).then(cards => {
        response.success(req, res, cards, 200)
    }).catch(next)
}

function getCards(req, res, next) {
    tarotController.getCards().then(cards => {
        response.success(req, res, cards, 200)
    }).catch(next)
}

function getOneCard(req, res, next) {
    const id = req.params.id;
    tarotController.getOneCard(id).then(card => {
        response.success(req, res, card, 200)
    }).catch(next)
}

module.exports = router;