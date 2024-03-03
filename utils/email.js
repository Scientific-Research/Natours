// NOTE: first of all, we have to install the nodemailer package!
// with this package, we can send the email using Node!
// the name nodemailer says: node + mailer => making the mail using node
const nodemailer = require('nodemailer');

const sendEmail = (options) => {
   // 1) Create a transporter
   const transporter = nodemailer.createTransport({
      service: 'Gmail',
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

   // 3) Actually send the email
};
