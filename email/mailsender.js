const nodemailer = require('nodemailer');
const senderInfo = require('./email');

const sendOutlookMail = async (param) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: senderInfo.user,
        pass: senderInfo.pass,
      },
    });

    const mailOptions = {
      from: senderInfo.user,
      to: param.toEmail,
      subject: param.subject,
      text: param.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendOutlookMail };
