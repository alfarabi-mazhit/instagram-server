const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  },
});

function sendEmail(to, subject, text) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to,
      subject,
      text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject({ error: true, message: error });
      } else {
        console.log("Email sent: " + info.response);
        resolve({ error: false, message: "Email sent: " + info.response });
      }
    });
  });
}

module.exports = sendEmail;
