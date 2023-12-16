/*The error.js file in the utils folder defines a function called err that creates and returns a
custom Error object.*/

/*The err function accepts two parameters: message and code. The message parameter is the error
message to be assigned to the Error object. The code parameter is optional and represents
the HTTP status code associated with the error.*/
function err(message, code) {
    /*Within the err function, create a new instance of Error using the provided message.
    Then, if a status code is provided, that code is assigned to the Error object using
    the statusCode property.*/
      let e = new Error(message);
  
      if (code) {
          e.statusCode = code;
      }
  
  /* Finally, the err function returns the Error object created. */
      return e;
  }
  
  module.exports = err;
  
  /* This module is useful for creating custom Error objects with specific messages and status codes.
  It can be used in other files to generate custom errors and properly handle errors in your application. */
  