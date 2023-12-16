const models = require('../../models')
const bcrypt = require('bcrypt');
const auth = require('../../auth');

module.exports = function () {
    async function registerUser(requestBody) {
        if (!requestBody || !requestBody.password) {
            // Manejar el caso cuando el objeto user o su propiedad password son undefined
            throw new Error('El objeto user o su propiedad password son undefined');
          }
        const {name, username, email, password, role} = requestBody
        const hashPass = await bcrypt.hash(password, 10)
        const isAdmin = role === 'administrator';
        const createdUser = await models.user.create({
            name,
            username,
            email,
            isAdmin,
            password: hashPass,
            role
          })
          delete createdUser.password;
          return createdUser;
    }
    async function loginUser(email, password) {
        /* Inside the try block, an object called data is created that contains the provided
      email and password. */
      try {
            const user = await models.user.findOne({
                where: {email: email},
            })
            if (user) {
                const payload = {
                    sub: user.id,
                    role: user.role
                }
                const token = auth.sign({ ...payload })
                const userLogged = {user, token}
                const lastLogin = await user.update({ lastLogin: new Date() });
                return userLogged
            } else {
                throw new Error('Información invalida');
             }
      } catch (error) {
        throw new Error('Error al realizar el inicio de sesión');
        }
    }
    async function logoutUser(username, password) {
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