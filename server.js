/*  TAROT API v0.0.1 - Marzo 2023 - index.js or sever.js */

/* Importing required modules: The code starts by importing the required modules for the application,
such as Express, Express session, Body Parser, Passport, Socket.io, and others. */

/* Express server creation: 
An Express instance is created and assigned to the constant app. */
const express = require('express');
const cors = require('cors');
const app = express();

//Import config file
const config = require('./config');

app.use(cors());
app.use(express.json());

//cross-origin resource sharing
var corsOptions = {
    origin: `http://${config.cors.host}:${config.cors.port}`
};
app.use(cors(corsOptions));

const session = require("express-session");

//Authentication
const passport = require ('passport');

const router = require('./network/routes');

//Errors
const errors = require('./network/errors');
app.use(errors);

//Sequelize models db
const models = require("./models");
const data = require('./data/cards')
models.sequelize.sync({ force: true }).then(async () => {
    await models.card.bulkCreate(data.cards)
    console.log("Drop and re-sync db.");
}).catch(function(err) {
    console.log(err, console.log("Something went wrong with the Database Update!"))
});


//load passport strategies
require('./auth/passport')(passport, models.user);

/* Authentication Configuration: Authentication is configured using Passport.js.
An Express session is initialized and used for authentication handling. */
/* Passport strategy load: Passport authentication strategies are loaded
Passport using the passport.js file and the user model defined in models.user. */
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session());
/* Routes configuration: Load and use the application router from the routes.js file.
This router will handle all incoming routes and requests. */
router(app);

// Define el puerto en el que escuchará el servidor
const PORT = process.env.PORT || 3000;
app.listen(config.api.port, () => {
    console.log(`Servidor en ejecución en el dirección y puerto ${config.api.host}:${config.api.port}`);
});
