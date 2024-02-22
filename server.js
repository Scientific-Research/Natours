const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const express = require('express');
// dotenv.config({ path: './config.env' });
dotenv.config({ path: './.env' });

// const app = express();
const app = require('./app');

// show us which environment we are using currently: => it shows us development
// console.log(app.get('env'));
// console.log(process.env); // shows us a bunch of node variables
// type this command in VSCode Terminal: NODE_ENV=development X=23 nodemon server.js
// 4) START SERVER => now, our exntry point to start our application is server.js and no longer
// app.js => i will change it in package.json for nodemon too.

const connect = async () => {
   try {
      const con = await mongoose.connect(process.env.DATABASE); // connect to MongoDB
      // const con = await mongoose.connect(process.env.DATABASE_LOCAL); // connect locally to monogosh
      // NOTE: we have to replace localhost with 127.0.0.1, otherwise, it will not work!
      // NOTE: In case of using the local database, we have to run mongod in Shell Terminal!
      // console.log(con);

      console.log('MongoDB connection successful!');
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
         console.log(`Server is listening on PORT ${PORT}`);
      });
   } catch (err) {
      console.log('Error connecting to MongoDB:', err.message);
   }
};
connect();

const tourSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
   },
   rating: {
      type: Number,
      default: 4.5,
   },
   price: {
      type: Number,
      required: [true, 'A tour must have a price'],
   },
});

const Tour = mongoose.model('Tour', tourSchema);

/* Tour here as Model in Mongoose is like a class in JS and we define an instance(object) of it
 => testTour*/
const TourDB = async () => {
   try {
      const testTour = new Tour({
         name: 'The Forest Hiker',
         rating: 4.7,
         price: 497,
      });
      // and then to save our Tour on DB:
      const doc = await testTour.save();
      console.log(doc);
   } catch (err) {
      console.log(`Error saving the values to MongoDB: ${err.message}`);
   }
};

TourDB();
