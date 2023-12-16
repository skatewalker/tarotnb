console.log(`Cargando archivo network/routes`);

const express = require('express');

//network del componente
const tarot = require('../components/tarot/tarot-network');
const user = require('../components/user/user-network')

const routes = function (server) {
    server.get("/", (req, res) => {
        try {
            res.send("TAROT API v0.0.1- The best digital tarot");
        } catch (err) {
            next(err);
        }
    });

    const ApiV1Router = express.Router();
    server.use("/api/v1", ApiV1Router);
    ApiV1Router.get("/", (req, res) => {
        res.json({ message: "Welcome to TAROT API v1.0" });
    });
    ApiV1Router.use('/tarot', tarot);
    ApiV1Router.use('/users', user);
}

module.exports = routes;