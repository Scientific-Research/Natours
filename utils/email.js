// NOTE: first of all, we have to install the nodemailer package!
// with this package, we can send the email using Node!
// the name nodemailer says: node + mailer => making the mail using node
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
   // 1) Create a transporter
   const transporter = nodemailer.createTransport({
      //   service: 'Gmail',
      // we use all the following data from mailtrap.io => https://mailtrap.io/inboxes/2651998/messages
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
         user: process.env.EMAIL_USERNAME,
         password: process.env.EMAIL_PASSWORD,
      },
      // NOTE: an then we have to activate this option in our gamil: "less secure app"
      // but now, with this service, we can faked to send emails to clients, but this emails
      // will never reach the clients and instead will trap in my mailtrap.
      // This is the website: mailtrap.io
   });

   // 2) Define the email options
   const mailOptions = {
      from: 'Code With Maximilian <creativemind309@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:
      // we simply leave it now as text!
   };

   // 3) Actually send the email
   await transporter.sendMail(mailOptions);
};

module.exports = sendEmail; // export as default from this module
