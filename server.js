const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const express = require('express');
// dotenv.config({ path: './config.env' });

// NOTE: How to catch the Sync unhandled requests:
process.on('uncaughtException', (err) => {
   console.log('UNCAUGHT EXCEPTION! >>> Shutting down...');
   console.log(err.name, err.message);
   process.exit(1); // 1: means exit unsuccessfully and 0: means exit successfully! but this

   // console.log(err.name, err.message);
   // NOTE: At first, a gracefully shutdown: we give the server time to finish all requests and
   // pending applications and only after than the server can be killed!
   // server.close(() => {
   //    process.exit(1); // 1: means exit unsuccessfully and 0: means exit successfully! but this
   //    // is the harsh shut down and before that we have to shutt down the server firstly as a
   //    // gracefully shutdown and then process.exit(1);
   // });
});

dotenv.config({ path: './.env' });

// const app = express();
const app = require('./app');

// show us which environment we are using currently: => it shows us development
// console.log(app.get('env'));
// console.log(process.env); // shows us a bunch of node variables
// type this command in VSCode Terminal: NODE_ENV=development X=23 nodemon server.js
// 4) START SERVER => now, our exntry point to start our application is server.js and no longer
// app.js => i will change it in package.json for nodemon too.
let server = '';
const connect = async () => {
   try {
      const con = await mongoose.connect(process.env.DATABASE); // connect to MongoDB
      // const con = await mongoose.connect(process.env.DATABASE_LOCAL); // connect locally to monogosh
      // NOTE: we have to replace localhost with 127.0.0.1, otherwise, it will not work!
      // NOTE: In case of using the local database, we have to run mongod in Shell Terminal!
      // console.log(con);

      console.log('MongoDB connection successful!');
      const PORT = process.env.PORT || 8000;
      server = app.listen(PORT, () => {
         console.log(`Server is listening on PORT ${PORT}`);
      });
   } catch (err) {
      console.log('Error connecting to MongoDB:', err.message);
   }
};
connect();

// NOTE: when we have a problem to connect to DB or totally when we have unhandledRejection, we
// can use the following process to handle it in our entire project:
process.on('unhandledRejection', (err) => {
   console.log('UNHANDLED REJECTION! >>> Shutting down...');
   console.log(err.name, err.message);
   // console.log(err.name, err.message);
   // NOTE: At first, a gracefully shutdown: we give the server time to finish all requests and
   // pending applications and only after than the server can be killed!
   server.close(() => {
      process.exit(1); // 1: means exit unsuccessfully and 0: means exit successfully! but this
      // is the harsh shut down and before that we have to shutt down the server firstly as a
      // gracefully shutdown and then process.exit(1);
   });
});

// THIS WAS JUST FOR TESTING AND WE DON'T NEED IT ANYMORE!
// /* Tour here as Model in Mongoose is like a class in JS and we define an instance(object) of it
//  => testTour*/
// const TourDB = async () => {
//    try {
//       const testTour = new Tour({
//          name: 'The Park Camper',
//          // rating: 4.7,
//          price: 997,
//       });
//       // and then to save our Tour on DB:
//       const doc = await testTour.save();
//       console.log(doc);
//    } catch (err) {
//       console.log(`Error saving the values to MongoDB: ${err.message}`);
//    }
// };

// TourDB();
