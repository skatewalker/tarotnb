const models = require('../../models')
const bcrypt = require('bcrypt');
const auth = require('../../auth');

module.exports = function () {
/*createUser: Create a new user in the database. Hashes the password before storing it.*/
async function registerUser(requestBody) {
    if (!requestBody || !requestBody.password) {/* Validar parámetros */
      /* Manejar el caso cuando el objeto user o su propiedad password son undefined */
      throw new Error('El objeto user o su propiedad password son undefined', {
        status: 400,
        message: 'El objeto user o su propiedad password son undefined.',
      });
    }
    // **si el usuario existe, Validar email y username**
    const existingUser = await models.user.findOne({
      where: {
        [models.Sequelize.Op.or]: [
          { email: requestBody.email },
          { username: requestBody.username },
        ],
      },
    });
    if (existingUser) {
      if (existingUser.email && existingUser.username) {
        throw new Error('El email y el nombre de usuario ya se encuentran registrados.');
      } else if (existingUser.email) {
        throw new Error('El email ya se encuentra registrado.');
      } else {
        throw new Error('El nombre de usuario ya se encuentra registrado.');
      }
    }
    const isStrongPasswordF = async function isStrongPassword(password) {
      /* La expresión regular 
        * **Al menos un dígito:** `(?=.*\d)`
        * **Al menos una letra minúscula:** `(?=.*[a-z])`
        * **Al menos una letra mayúscula:** `(?=.*[A-Z])`
        * **Al menos un carácter especial:** `(?=.*[!@#%^&*])`
     */
      const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,6})$/;
      const isEmailValid = emailRegex.test(requestBody.email);
      if (!isEmailValid) {
        // La dirección de correo electrónico no es válida
        throw new Error('El correo electrónico no es válido.');
      }

      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]+$/;
      return passwordRegex.test(password);
    }
  // **Validar fortaleza de contraseña**
    const isStrongPassword = await isStrongPasswordF(requestBody.password);
    if (!isStrongPassword) {
      throw new Error('La contraseña no cumple con los criterios de seguridad.');
    }
  // **Desestructuración de datos**
    const {name, username, email, password, role, buyer, seller} = requestBody
    const isAdmin = role === 'administrator';
  // **Hashear contraseña**
    const hashPass = await bcrypt.hash(password, 10)
    const user = {name, username, email, password: hashPass, role, buyer, seller, isAdmin}
  // **Crear usuario**
    const createdUser = await models.user.create(user)
    delete createdUser.password;
    return createdUser;
}
/**
 * Registra un nuevo usuario.
 *
 * @param requestBody Objeto con los datos del usuario.
 * @returns Objeto con los datos del usuario creado.
 */

    async function loginUser(email, password) {
        /* Inside the try block, an object called data is created that contains the provided
      email and password. */
      try {
        const user = await models.user.findOne({
          where: {email: email},
        })
        if (user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          if (bcrypt.compare(password, hashedPassword)) {
            const payload = {
              sub: user.id,
              role: user.role
            }
            const token = auth.sign({ ...payload })
            const userLogged = {user, token}
            const lastLogin = await user.update({ lastLogin: new Date() });
            return userLogged
          } else {
            throw new Error('Contraseña incorrecta');
          }
        } else {
          throw new Error('Información invalida');
        }
      } catch (error) {
        throw new Error('Error during login: ' + error.message);
        }
    }

    async function logoutUser() {
      // Elimina el token de sessionStorage
      sessionStorage.removeItem('token');
      const message = {message:'Sesión cerrada correctamente.'}
      return message
    }
    
    /* findUserByEmail: Get a user by their email.*/
    async function findUserByEmail(email) {
        /*const emailUser = await store.getByEmail(authTable, {
          where: { email }
        });*/
          //const emailUser = await store.getByEmail(authTable, email);
          const emailUser = await models.user.findOne({
            where: {email: email}
          })
        return emailUser
      }

      async function getUsers() {
        const users = await models.user.findAll({
          include: [{ model:models.shuffling_history, as:'history'}],
        })
        return users;
      }

      async function getOneUser(requestParamsId) {
        const user = await models.user.findByPk(requestParamsId, {
          include: [{ model:models.shuffling_history, as:'history'}],
        })
        return user;
      }

      async function getShufledUserHistory(userId) {
        const user = await models.user.findByPk(userId, {
          include: [{ model: models.shuffling_history, as: 'history'}]
        });
        if (!user) {
          // Manejo de caso en el que no se encuentra el usuario.
          throw new Error('Usuario no encontrado');
        }
        return user.history;
      }

    return {
        registerUser,
        loginUser,
        logoutUser,
        findUserByEmail,
        getUsers,
        getOneUser,
        getShufledUserHistory
    };
}