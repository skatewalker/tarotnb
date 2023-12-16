/* The response.js file in the network folder contains two functions that are
used to send responses from the server: */

/* exports.success: This function is used to send a successful response to the client.
It takes as parameters req (the request), res (the response), message (the message of the response)
and status (the HTTP status code). The implementation sets the status code, message, and response
body in JSON format. The default status code is 200. */
exports.success = function (req, res, message, status) {
    let statusCode = status || 200;
    let statusMessage = message || '';

    res.status(status).send({
        error: false,
        status: status,
        body: message,
    });
}

/* exports.error: This function is used to send an error response to the client.
It takes the same parameters as the exports.success function. The implementation sets the status code,
message, and response body in JSON format. The default status code is 500 and the default message is
"Internal server error".*/
exports.error = function (req, res, message, status) {
    let statusCode = status || 500;
    let statusMessage = message || 'Internal server error';

    res.status(statusCode).send({
        error: false,
        status: status,
        body: message,
    });
}