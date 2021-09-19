const nodemailer = require('nodemailer');

require('dotenv').config();
const { EMAIL_SENDING_LOGIN, EMAIL_SENDING_PASS } = process.env;

const createSenderNodemailer = async bodyMsg => {
  const config = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_SENDING_LOGIN,
      pass: EMAIL_SENDING_PASS,
    },
  };
  const transporter = nodemailer.createTransport(config);
  return await transporter.sendMail({ ...bodyMsg, from: EMAIL_SENDING_LOGIN });
};

module.exports = { createSenderNodemailer };
