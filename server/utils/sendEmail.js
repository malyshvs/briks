const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, token) {
  const url = `${process.env.CLIENT_URL}/verify/${token}`;
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

  try {
    const info = await transporter.sendMail({
      from: `"Команда проекта СЭ БРИКС" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Подтверждение регистрации",
      html: `
        <h3>Здравствуйте!</h3>
        <p>Подтвердите регистрацию, перейдя по ссылке:</p>
        <a href="${url}">${url}</a>
      `,
    });

    console.log("Письмо успешно отправлено:", info.messageId);
    console.log("URL письма:", nodemailer.getTestMessageUrl?.(info) || "—");
  } catch (err) {
    console.error("Ошибка при отправке письма:", err);
    throw err;
  }
}

module.exports = { sendVerificationEmail };
