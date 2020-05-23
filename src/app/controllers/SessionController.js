const User = require("../models/User")

const crypto = require('crypto')
const mailer = require("../../lib/mailer")
const { hash } = require("bcryptjs")

module.exports = {
  loginForm(req, res) {
    return res.render("session/login")
  },
  login(req, res) {
    req.session.userId = req.user.id

    return res.redirect("/users")
  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  },
  forgotForm(req, res) {
    return res.render("session/forgot-password")
  },
  async forgot(req, res) {
    const user = req.user

    try {
      const token = crypto.randomBytes(20).toString("hex")

      let now = new Date()
      now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })

      await mailer.sendMail({
        to: user.email,
        from: "no-replay@launchstore.com.br",
        subject: "Recuperação de senha",
        html: `<h2>Perdeu a chave?</h2>
            <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
            <p>
                <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                    RECUPERAR SENHA
                </a>
            </p>
            `
      })

      return res.render("session/forgot-password", {
        success: "Verifique seu e-mail para resetar sua senha!"
      })
    } catch (error) {
      console.error(error)
      return res.render("session/forgot-password", {
        error: "Erro inesperado, tente novamente"
      })
    }


  },
  resetForm(req, res) {
    return res.render("session/password-reset", { token: req.query.token })
  },
  async reset(req, res) {
    const user = req.user
    const { password, token } = req.body

    try {

      const newPassword = await hash(password, 8)

      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: "",
      })

      return res.render("session/login", {
        user: req.body,
        success: "Senha atualizada! Faça seu log in"
      })

    } catch (error) {
      console.error(error)
      return res.render("session/password-reset", {
        user: req.body,
        token,
        error: "Erro inesperado, tente novamente"
      })
    }
  }
}
