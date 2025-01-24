const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  //==> Creating a transporter , which will act as a medium to provide service .
  console.log('==========env data ================');
  console.log(process.env.MAIL_HOST);
  console.log(process.env.MAIL_PORT);
  console.log(process.env.MAIL_USER);
  console.log(process.env.MAIL_USER_PASSWORD);

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_USER_PASSWORD,
    },
  });

  //==> email related information .
  const mailInfo = {
    from: 'taekwondo4400@gmail.com ',
    // to: 'prakashgrg4400@gmail.com',
    // subject: 'Test mail',
    // text: 'Hello World',
    to: option.mail,
    subject: option.subject,
    text: option.message,
  };

  console.log('========= options ===========');
  console.log(option.message);
  console.log(option.mail);
  console.log(option.subject);

  await transporter.sendMail(mailInfo);
};

module.exports = sendEmail;
