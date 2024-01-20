/*The router for the user-related routes in your application is defined here.
The router uses controllers and security functions defined in other files to handle requests.*/
const express = require('express');
const router = express.Router();
const response = require('../../network/response');
const userController = require('./index');
const passport = require ('passport');

/* router.get('/'): This route handles a GET request to the root route ("/")
and calls the listUser function of the user controller. Returns the list of
users as a response. */
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/', getUsers)
router.get('/:id', passport.authenticate('jwt', {session:false}), getOneUser)
router.get('/:id/history', getShufledUserHistory)


// Internal functions
function registerUser(req, res, next) {
    const requestBody = req.body
    console.log(requestBody)
    userController.registerUser(requestBody).then(user => {
        response.success(req, res, user, 200)
    }).catch(next)
}

function loginUser(req, res, next) {
    const { email, password } = req.body;
    userController.loginUser(email, password).then(token => {
        response.success(req, res, token, 200)
    }).catch(next)
}

function logoutUser(req, res, next) {
    const username = req.body.username
    const password =  req.body.password
    userController.logoutUser(username, password).then(token => {
        response.success(req, res, token, 200)
    }).catch(next)
}

function getUsers(req, res, next) {
    userController.getUsers().then(users => {
        response.success(req, res, users, 200)
    }).catch(next)
}

function getOneUser(req, res, next) {
    const requestParamsId = req.params.id 
    userController.getOneUser(requestParamsId).then(user => {
        response.success(req, res, user, 200)
    }).catch(next)
}

function getShufledUserHistory(req, res, next) {
    const userId = req.params.id; 
    userController.getShufledUserHistory(userId).then(history => {
        response.success(req, res, history, 200)
    }).catch(next)
}

module.exports = router;