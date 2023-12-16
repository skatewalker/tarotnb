/* The index.js file in the auth folder contains functions related to authentication and authorization
using JWT tokens (JSON Web Tokens). */

/* The jsonwebtoken module is imported to handle JWT token generation and verification. */
const jwt = require('jsonwebtoken');
/* The application configuration is imported from the config.js file, which contains sensitive
information such as the secret used to sign and verify the JWT tokens. */
const config = require('../config');
const error = require('./error');

/* The secret is assigned to the secret variable. */
const secret = config.jwt.secret;

/* The sign(data) function takes a data object and returns a signed JWT token using the secret. */
function sign(data) {
    return jwt.sign(data, secret);
}
/* The verify(token) function takes a JWT token and verifies it using the secret,
returning the decrypted data if the verification is successful. */
function verify(token) {
    return jwt.verify(token, secret)
}

/* The check constant is an object that contains functions to perform authorization checks. */
const check = {
  /* The function own(req, owner) is used to check if the authenticated user is the owner
  of a given resource. Decode the token in the request header using the decodeHeader(req)
  function and compare the decoded user id with the provided owner. If they are not equal,
  an error is thrown. */
    own: function(req, owner) {
        const decoded = decodeHeader(req);
        console.log(decoded);

        if (decoded.id !== owner) {
            throw error('No puedes hacer esto', 401);
        }
    },
/* The logged(req) function is used to perform login checks.
It also decodes the token in the request header using the decodeHeader(req) function.
You can add additional logic to handle different login-related scenarios.*/
    logged: function(req, owner) {
        const decoded = decodeHeader(req);
    },
}

/* The getToken(auth) function is used to get the authentication token of the request.
Verifies that the token is present and has the correct format (Bearer Token).
If it does not meet these criteria, an error is thrown.*/
function getToken(auth) {
    if (!auth) {
        throw error('No viene token', 401);
    }

    if (auth.indexOf('Bearer ') === -1) {
        throw error('Formato invalido', 401);
    }

    let token = auth.replace('Bearer ', '');
    return token;
}
/* The decodeHeader(req) function is used to decode the authentication token in the request header.
Extracts the request token using the getToken(auth) function, verifies it using the verify(token) function,
and assigns the decoded data to the req.user object. Then, it returns the decoded data.*/
function decodeHeader(req) {
    const authorization = req.headers.authorization || '';
    const token = getToken(authorization);
    const decoded = verify(token);

    req.user = decoded;

    return decoded;
}

module.exports = {
    sign,
    check,
};

/* This file provides functions to sign and verify JWT tokens,
as well as to carry out authorization checks and handling of the token in the requests.
These functions can be used in other parts of the project to implement the authentication layer.
and authorization. */
