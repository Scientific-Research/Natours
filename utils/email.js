// NOTE: first of all, we have to install the nodemailer package!
// with this package, we can send the email using Node!
// the name nodemailer says: node + mailer => making the mail using node
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome();

module.exports = class Email {
   constructor(user, url) {
      // Constructor will be running when a new object from this class will be created!
      this.to = user.email;
      this.firstName = user.name.split(' ')[0];
      this.url = url;
      this.from = `Code With Maximilian <${process.env.EMAIL_FROM}>`;
   }
   newTransport() {
      if (process.env.NODE_ENV === 'production') {
         // Sendgrid
         return 1;
      }

      return nodemailer.createTransport({
         //   service: 'Gmail',
         // we use all the following data from mailtrap.io => https://mailtrap.io/inboxes/2651998/messages
         // host: 'sandbox.smtp.mailtrap.io',
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         // port: 2525,
         auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
            // user: 'f88b84dd82e13c',
            // pass: '7dc28f246fe547',
         },
         // NOTE: and then we have to activate this option in our gamil: "less secure app"
         // but now, with this service, we can faked to send emails to clients, but this emails
         // will never reach the clients and instead will trap in my mailtrap.
         // This is the website: mailtrap.io
      });
   }
   async send(template, subject) {
      // Send the actual email:
      // 1) Render HTML based on a pug template
      // renderFile takes the pug file and render it to the real html file:
      // __dirname is current folder, where email.js is located! => util
      const html = pug.renderFile(
         `${__dirname}/../views/email/${template}.pug`,
         {
            firstName: this.firstName,
            url: this.url,
            subject: subject,
         }
      );

      // 2) Define email options
      const mailOptions = {
         // NOTE: Actually it will not send the email to this email address: user@test.io,
         //rather, it will send it to our faked email container as mailtrap.io to test it and when everything is OK, we will implement it in a real web service!
         from: this.from,
         to: this.to,
         // subject: subject,
         // html: html,
         subject,
         html,
         // to convert from html to text: => the package html-to-text was installed!
         // text: htmlToText.fromString(html), => fromString is already deprecated!
         text: htmlToText.convert(html),
      };
      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
   }
   async sendWelcome() {
      // welcome would be the pug template that will be created later!
      await this.send('welcome', 'Welcome to the Natours Family!');
   }

   async sendPasswordReset() {
      await this.send(
         'passwordReset',
         'Your password reset token (valid for only 10 minutes)'
      );
   }
};

// const sendEmail = async (options) => {
//    // 1) Create a transporter
//    // try {
//    // const transporter = nodemailer.createTransport({
//    //    //   service: 'Gmail',
//    //    // we use all the following data from mailtrap.io => https://mailtrap.io/inboxes/2651998/messages
//    //    // host: 'sandbox.smtp.mailtrap.io',
//    //    host: process.env.EMAIL_HOST,
//    //    port: process.env.EMAIL_PORT,
//    //    // port: 2525,
//    //    auth: {
//    //       user: process.env.EMAIL_USERNAME,
//    //       pass: process.env.EMAIL_PASSWORD,
//    //       // user: 'f88b84dd82e13c',
//    //       // pass: '7dc28f246fe547',
//    //    },
//    //    // NOTE: and then we have to activate this option in our gamil: "less secure app"
//    //    // but now, with this service, we can faked to send emails to clients, but this emails
//    //    // will never reach the clients and instead will trap in my mailtrap.
//    //    // This is the website: mailtrap.io
//    // }
//    // );

//    // 2) Define the email options
//    // const mailOptions = {
//    //    // NOTE: Actually it will not send the email to this email address: user@test.io,
//    //    //rather, it will send it to our faked email container as mailtrap.io to test it and when everything is OK, we will implement it in a real web service!
//    //    from: 'Code With Maximilian <user@test.io>',
//    //    to: options.email,
//    //    subject: options.subject,
//    //    text: options.message,
//    //    // html:
//    //    // we simply leave it now as text!
//    // };

//    // 3) Actually send the email
//    await transporter.sendMail(mailOptions);
//    console.log('Email sent successfully!');
//    // } catch (err) {
//    //    console.log('Error sending email:', err);
//    // }
// };

// module.exports = sendEmail; // export as default from this module
