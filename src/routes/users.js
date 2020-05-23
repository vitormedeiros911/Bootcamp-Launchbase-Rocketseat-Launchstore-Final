const express = require("express")
const routes = express.Router()

const SessionController = require("../app/controllers/SessionController")
const UserController = require("../app/controllers/UserController")

const UserValidator = require("../app/validators/user")
const SessionValidator = require("../app/validators/session")

const { isLoggedRedirectToUsers, onlyUsers } = require("../app/middlewares/session")

routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
  .post('/login', SessionValidator.login, SessionController.login)
  .post('/logout', SessionController.logout)

  .get('/forgot-password', SessionController.forgotForm)
  .get('/password-reset', SessionController.resetForm)
  .post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
  .post('/password-reset', SessionValidator.reset, SessionController.reset)

  .get("/register", UserController.registerForm)
  .post("/register", UserValidator.post, UserController.post)

  .get("/", onlyUsers, UserValidator.show, UserController.show)
  .put("/", UserValidator.update, UserController.update)
  .delete("/", UserController.delete)

  .get('/ads', UserController.ads)

module.exports = routes
