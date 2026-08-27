require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, replyTo, subject, text, html }) => {
  await transporter.sendMail({
    from: `"Lau Lash Atelier" <${process.env.SMTP_USER}>`,
    to,
    replyTo,
    subject,
    text,
    html,
  });
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  return res.status(200).json({
    message: 'A foglalási e-mail funkció ideiglenesen kikapcsolva. A látogatói jelentkezés hamarosan újra elérhető.',
  });
};
