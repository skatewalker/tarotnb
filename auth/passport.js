/* The index.js file is responsible for configuring the local authentication strategy using Passport.js.
The content of the file is explained below:*/

/* Import the bcrypt module for password encryption. */
const bcrypt = require('bcrypt');

const authController = require('../components/user/user-controller')
const controller = new authController();

/* The application configuration is imported from the config.js file, which contains sensitive
information such as the secret used to sign and verify the JWT tokens. */
const config = require('../config');
/* The secret is assigned to the secret variable. */
const secret = config.jwt.secret;

/* Export a function that takes two parameters: passport and user.
The passport parameter is the Passport object that is passed to the file from elsewhere in the project,
and user represents the user model. */
module.exports = function(passport, user) {
  /* Assign the user model to the User object for use in the functions. */
    const User = user;
    const LocalStrategy = require('passport-local').Strategy;
    const JwtStrategy = require('passport-jwt').Strategy;
    const ExtractJwt = require('passport-jwt').ExtractJwt;
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['HS256'],
      secretOrKey: secret
    }
/* Define the serialization of the user using passport.serializeUser().
This function is executed when the user is authenticated and their ID is saved in the session.
In this case, the user ID is saved. */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

/* Define the deserialization of the user using passport.deserializeUser().
This function is executed on every request to load user data from the session and assign
it to the req.user object. In this case, the user is looked up in the database using his ID. */
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use('jwt', new JwtStrategy(options, (payload, done) => {
      return done(null, payload)
    }))

    passport.use('local',  new LocalStrategy({
      /* Specify the username field as email and the password field as password.*/
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
      const user = await controller.findUserByEmail(email)
        if(!user) {
          return done(null, false, { message: 'No existe el usuarios' })
        }
        //console.log( user[0].password)
        const isMatch = await bcrypt.compare(password, user[0].password)
        if(!isMatch) {
          return done(null, false, { message: 'No tienes autorización jj' })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }))

/* Use Passport's local strategy (passport.use('local-signup', new LocalStrategy(...)))
for local user registration. */
    passport.use('local-signup', new LocalStrategy({
            /* Specify the username field as email and the password field as password.*/
            usernameField: 'email',
            passwordField: 'password',
            /* Set passReqToCallback to true, allowing the entire request to be passed to the callback function.*/
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        (req, email, password, done) => {

            const generateHash = function(password) {
                return bCrypt.hashSync(password, bcrypt.genSaltSync(10), null);
            };
            /* In the callback function, check if a user with the same email already exists in the database.
            If it exists, an error message is returned.*/
            User.findOne({where: {email: email}}).then(function(user) {
                if (user) {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                }
                /* If no user with the same email exists, a hash of the provided password is generated
                and a new user is created in the database with the information provided in the request.*/
                else {
                    var userPassword = generateHash(password);
                    var data = {
                        email: email,
                        password: userPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };
                    /* The result of the new user creation is returned in the callback function.*/
                    User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));
}


/* This file configures the local authentication strategy using Passport.js.
Defines user serialization and deserialization, as well as registration strategy
local users using an email and password field. */

