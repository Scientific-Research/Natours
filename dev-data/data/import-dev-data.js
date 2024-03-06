const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
// const express = require('express');
// dotenv.config({ path: './config.env' });
dotenv.config({ path: './.env' });

// const app = express();
// const app = require('./app');

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
    //   const PORT = process.env.PORT || 8000;
    //   app.listen(PORT, () => {
    //      console.log(`Server is listening on PORT ${PORT}`);
    //   });
  } catch (err) {
    console.log('Error connecting to MongoDB:', err.message);
  }
};
connect();

// READ JSON FILE:
// using JSON.parse() to convert the json to javascrip objects
// const tours = JSON.parse(fs.readFileSync('./data/tours-simple.json', 'utf-8'));
const tours = JSON.parse(
  //   fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

// IMPORT DATA INTO MONGODB: => first of all, we have to delete the old data and then load or import the new data in MongoDB!
// NOTE: This is the command in Terminal to import the data after deleting them in database:
// node ./dev-data/data/import-dev-data.js --import
const importData = async () => {
  try {
    const importedData = await Tour.create(tours);
    console.log('Data loaded successfully from JSON data to MongoDB!');

    //   res.status(201).json({
    //      status: 'success',
    //      importedData: importedData,
    //   });
  } catch (err) {
    console.log('Error Loading Data from JSON data to MongoDB! ' + err.message);
    //   res.status(400).json({ status: 'fail', message: err.message });
  }
  process.exit(); // when the delete process is finished, it will be terminated in VSCode!
};
// importData();

// DELETE ALL DATA FROM DB: => first of all, we have to delete the old data and then load or import the new data in MongoDB!
// NOTE: this is the command in Terminal to delete the data:
// node ./dev-data/data/import-dev-data.js --delete
const deleteAllDataFromDB = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully!');

    //   res.status(200).json({
    //      status: 'success',
    //   });
  } catch (err) {
    console.log('Error Deleting All Data From MongoDB ' + err.message);
    //   res.status(400).json({ status: 'fail', message: err.message });
  }
  process.exit(); // when the delete process is finished, it will be terminated in VSCode!
};
// deleteAllDataFromDB();
// console.log(process.argv);
// NOTE: WHEN WE ARE USING THIS BELOW PROCESS.ARGV[] COMMAND; WE DON'T NEED TO CALL THESE TWO FUNCTIONS
// ANYMORE: 1- deleteAllDataFromDB(); 2- importData(); THIS COMMAND WILL DOES THE SAME!

// NOTE: AFTER RUNNING THIS COMMAND IN VSCODE TERMINAL:
// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteAllDataFromDB();
}
