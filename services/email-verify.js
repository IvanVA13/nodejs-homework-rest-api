const Mailgen = require('mailgen');
require('dotenv').config();

const { NGROK_TUNNEL } = process.env;

class SenderVerifyEmailToUser {
  constructor(env, sender) {
    switch (env) {
      case 'development':
        this.link = NGROK_TUNNEL;
        break;
      case 'production':
        this.link = 'link fro production';
        break;
      default:
        this.link = NGROK_TUNNEL;
        break;
    }
    this.sender = sender;
  }
  #createEmailTemplate(verifyToken) {
    const mailGenerator = new Mailgen({
      theme: 'salted',
      product: {
        name: 'Verify email',
        link: this.link,
      },
    });
    const email = {
      body: {
        name: 'New jungle dweller',
        intro: "Welcome to the jungle, we've got fun and games...",
        action: {
          instructions: 'To get fun and games with jungle, please click here:',
          button: {
            color: '#29ab87',
            text: 'Confirm your jungle account',
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    const emailBody = mailGenerator.generate(email);
    return emailBody;
  }
  async sendVerifyEmail(email, verifyToken) {
    const emailBodyHtml = this.#createEmailTemplate(verifyToken);
    const emailVerify = {
      to: email,
      subject: 'Verify your jungle account',
      html: emailBodyHtml,
    };
    const sendedEmailVerify = await this.sender(emailVerify);
    console.log(sendedEmailVerify);
  }
}

module.exports = SenderVerifyEmailToUser;
