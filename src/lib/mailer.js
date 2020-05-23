const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f48f89d6d02e49",
    pass: "fabd7a1011153d"
  }
});


