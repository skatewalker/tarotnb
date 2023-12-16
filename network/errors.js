/* The error.js file contains a function called errors that acts as an error handling middleware. */
const response = require('./response');

/* The errors function takes four parameters: err (the error object), req (the request),res (the response),
and next (the next middleware).
This function is used to catch and handle errors that occur during request processing. */
function errors(err, req, res, next) {
  /* print the error object to the console and then get the error message (err.message)
  and status code (err.statusCode) from the error object. If either of these values is not present,
  a default value is used: "Internal Error" for the message and 500 for the status code. */
    console.error('[error]', err);

    const message = err.message || 'Error interno';
    const status = err.statusCode || 500;

    response.error(req, res, message, status);
}

/* Finally, the response.error function imported from the response.js file is used
to send an error response to the client, using the message
and the status code obtained. */
module.exports = errors;

/* Este middleware de manejo de errores se usa en las rutas o en otros middlewares
para capturar los errores y enviar respuestas de error consistentes al cliente. */