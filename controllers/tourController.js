// const fs = require('fs');
const Tour = require('../models/tourModel');

// let tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
// NOTE: WE DON'T NEED THIS ANYMORE, IT WAS JUST READING THE JSON FILE FOR TESTING PURPOSES
// I WILL USE ABOVE TOURS IMPORTED FROM TOURMODEL WHICH READS DATA FROM MONGODB!
// let tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// const tourRouter = express.Router();
// app.use('/api/v1/tours', router);
// app.use('/api/v1/tours', tourRouter);
// this middleware is placed before all the other middlewares to check if the id is valid
// then goes to the next middleware, otherwise, it will return and will not go to other middlewares.
// NOTE: WE DON'T NEED THIS checkID MIDDLEWARE ANYMORE, BECAUSE MONGODB WILL NEVER GIVE US FALSE
// ID WHICH IS GREATED THAN THE LENGTH OF TOURS:
// exports.checkID = (req, res, next, val) => {
//    console.log(`Tour id is: ${val}`); // val has the value of id
//    if (req.params.id * 1 > tours.length) {
//       return res.status(404).json({
//          status: 'fail',
//          message: 'Invalid ID -- Checked by checkID middleware in tourController.js',
//       });
//    }
//    next();
// };

// Check Body
// NOTE: MONGOOSE SCHEMA WILL TAKE CARE OF THAT AND WE DON'T NEED IT HERE ANYMORE!
// exports.checkBody = (req, res, next) => {
//    if (!req.body.name || !req.body.price) {
//       return res.status(400).json({
//          status: 'fail',
//          message: 'Missing name or price properties!',
//       });
//    }
//    next();
// };

// 2) ROUTE HANDLERS
// const getAllTours = (req, res,next) => {
exports.getAllTours = async (req, res) => {
   try {
      // NOTE: GETTING ALL TOURS USING find()-- no need to make a new instance(object) and using
      // save() function too!
      const tours = await Tour.find();
      console.log(tours);
      res.status(200).json({ status: 'success', AllTours: tours });
   } catch (err) {
      console.log('Error to get all the tours from MongoDB!' + err.message);
      res.status(400).json({ status: 'fail', message: err.message });
   }

   // console.log(req.requestTime);
   // res.status(200).json({
   //    status: 'success',
   //    requestedAt: req.requestTime,
   //    // results: tours.length,
   //    // tours,
   // });
   // // next();
};

exports.getTour = async (req, res) => {
   const id = req.params.id;
   console.log(id);

   try {
      // NOTE: GETTING ONLY ONE TOUR USING findById(id)-- no need to make a new instance(object) and using
      // save() function too!
      const tour = await Tour.findById(id);
      // NOTE: Tour.findOne({_id: req.params.id})
      console.log(tour);
      res.status(200).json({ status: 'success', OneTour: tour });
   } catch (err) {
      console.log('Error to get one tour from MongoDB!' + err.message);
      res.status(400).json({ status: 'fail', message: err.message });
   }

   // const id = req.params.id;
   // console.log('id: ' + id);

   // try {
   //    // console.log('Tours length: ' + tours.length);
   //    // const tour = tours.find((item) => item.id === parseInt(id));
   //    // if (!tour) throw new Error('Invalid ID! Please try again later!');
   //    // console.log(tour);
   //    // res.status(200).json({
   //    //    status: 'success',
   //    //    tour,
   //    // });
   // } catch (err) {
   //    res.status(404).json({
   //       status: 'fail',
   //       message: err.message,
   //    });
   // }
};

exports.createTour = async (req, res) => {
   // const newTour = req.body;
   // console.log(newTour);
   // NOTE: THIS IS THE FIRST METHOD TO CREATE THE DATA. In this method, we make a new instance(object)
   // from Tour but in the next method, we use Tour direct with create(), that's why don't need
   // to create a new instance of Tour. In addition to that, we don't need to use save().
   // try {
   //    const tour = new Tour({
   //       name: 'Test Tour-5',
   //       rating: 4.7,
   //       price: 997,
   //    });
   //    const doc = await tour.save();
   //    console.log(doc);
   //    res.status(201).json({
   //       status: 'success',
   //       createdTour: doc,
   //    });
   // } catch (err) {
   //    console.log(`Error creating the tour data on MongoDB: ${err.message}`);
   //    res.status(404).json({ message: 'Error creating the tour data on MongoDB!' });
   // }

   // NOTE: THIS IS THE SECOND METHOD TO CREATE THE DATA, when we use create() function, we
   // don't need to make a new instance(object) from Tour and also we don't need to use save()
   // function anymore. But in first method, we have to use both of them!
   try {
      // const newTour = await Tour.create({
      //    name: 'Test Tour-6',
      //    rating: 4.7,
      //    price: 997,
      // });
      const newTour = await Tour.create(req.body); // recieve the data from Postman
      // doc = await newTour.save();
      console.log(newTour);
      res.status(201).json({
         status: 'success',
         createdTour: newTour,
      });
   } catch (err) {
      console.log(`Error creating the tour data on MongoDB: ${err.message}`);
      // res.status(400).json({ status: 'fail', message: 'Error creating the tour data on MongoDB!' });
      res.status(400).json({ status: 'fail', message: err.message });
   }

   // const id_1 = tours.length - 1;
   // const newId = id_1 + 1;
   // const newTour = req.body;
   // newTour.id = newId;
   // console.log(newTour);
   // tours.push(newTour);
   // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
   //    res.status(201).json({
   //       status: 'success',
   //       tours: newTour,
   //    })
   // );
};

exports.updateTour = async (req, res) => {
   const id = req.params.id;

   try {
      const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
         new: true, // to send the new(updated) tour to the client.
         runValidators: true,
      });
      console.log(updatedTour);
      res.status(200).json({
         status: 'success',
         updatedTour: updatedTour,
      });
   } catch (err) {
      console.log('Error updating the Tour!' + err.message);
      res.status(400).json({ status: 'fail', message: err.message });
   }

   // try {
   //    const tour = tours.find((item) => item.id === parseInt(id));
   //    if (!tour) throw new Error('Invalid ID! Please try again later!');
   //    console.log('Before Patch => Updating');
   //    console.log(tour);

   //    const newTour = req.body;

   //    newTour.id = parseInt(id);
   //    let toursId = tours.indexOf(tours[id]);
   //    tours[toursId] = newTour;

   //    console.log('After Patch => Updating');
   //    console.log(newTour);

   //    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
   //       res.status(201).json({
   //          status: 'success',
   //          tours: newTour,
   //       })
   //    );
   // } catch (err) {
   //    res.status(404).json({
   //       status: 'fail',
   //       message: err.message,
   //    });
   // }
};

exports.deleteTour = async (req, res) => {
   const id = req.params.id;

   try {
      const deletedTour = await Tour.findByIdAndDelete(id);
      if (!deletedTour) throw new Error('This Tour already deleted!');
      console.log(deletedTour);
      res.status(200).json({
         status: 'success',
         deletedTour: deletedTour,
      });
   } catch (err) {
      console.log('Error deleting the tour data: ' + err.message);
      res.status(400).json({ status: 'fail', message: err.message });
   }

   // try {
   //    const tour = tours.find((item) => item.id === parseInt(id));
   //    if (!tour) throw new Error('No tour with this ID anymore! pick a different one.');

   //    let deletedTour = tours.filter((el) => el.id === parseInt(id));
   //    let notDeletedTours = tours.filter((el) => el.id !== parseInt(id));
   //    console.log(deletedTour);
   //    tours = notDeletedTours;
   //    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
   //       res.status(200).json({
   //          status: 'success',
   //          deletedTour: deletedTour,
   //       })
   //    );
   // } catch (err) {
   //    res.status(404).json({
   //       status: 'fail',
   //       message: err.message,
   //    });
   // }
};
