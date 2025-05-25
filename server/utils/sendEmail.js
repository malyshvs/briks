const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // или 'yandex', 'mail.ru', если используешь другое
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, token) {
  const url = `${process.env.CLIENT_URL}/verify/${token}`;

  await transporter.sendMail({
    from: `"Конкурс" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Подтверждение регистрации",
    html: `
      <h3>Здравствуйте!</h3>
      <p>Спасибо за регистрацию. Пожалуйста, подтвердите свою почту, перейдя по ссылке ниже:</p>
      <a href="${url}">${url}</a>
      <br><br>
      <p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>
    `,
  });
}

module.exports = { sendVerificationEmail };
