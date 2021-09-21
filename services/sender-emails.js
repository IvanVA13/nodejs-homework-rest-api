const nodemailer = require('nodemailer');

const sgMail = require('@sendgrid/mail');

require('dotenv').config();
const { EMAIL_SENDING_LOGIN, EMAIL_SENDING_PASS, SENDGRID_API_KEY } =
  process.env;

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

const createSenderSendGrid = async bodyMsg => {
  sgMail.setApiKey(SENDGRID_API_KEY);

  return await sgMail.send({
    ...bodyMsg,
    from: `Jungle <${EMAIL_SENDING_LOGIN}>`,
  });
};

module.exports = { createSenderNodemailer, createSenderSendGrid };
