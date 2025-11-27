const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendWelcomeEmail(to, name) {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const subject = 'Welcome to RealEstate App';
  const text = `Hello ${name || ''},\n\nThank you for registering at our RealEstate app.`;
  const html = `<p>Hello ${name || ''},</p><p>Thank you for registering at our RealEstate app.</p>`;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
  return info;
}

module.exports = { sendWelcomeEmail };
