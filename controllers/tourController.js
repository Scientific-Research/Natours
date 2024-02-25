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
      console.log(req.query);
      // 1 - BUILD QUERY
      // 1A) Filtering
      const queryObj = { ...req.query }; // we made a copy of the req.query and converted it to an Object!
      const excludedFields = ['page', 'sort', 'limit', 'fields'];

      // Remove all these excluded fields from queryObj: => we don't need to have a new array, that's why we use FOREACH:
      excludedFields.forEach((el) => delete queryObj[el]);

      // 1B) Advanced filtering:
      // NOTE: Exercise: {difficulty:'easy', duration:{$gte:5}}
      // we can do all these using replace() => gte, gt, lte, lt using regular expression
      // In Postman: 127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5
      // In VSCode Terminal:console.log(req.query)=>{ difficulty: 'easy', duration: { gte: '5' } }
      console.log('queryObj' + queryObj);
      let queryStr = JSON.stringify(queryObj);
      console.log('queryStr' + queryStr);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      console.log(JSON.parse(queryStr)); // we want the Object here!

      // NOTE: THIS IS THE THIRD METHOD TO WRITE A SEARCH QUERY:
      // const tours = await Tour.find(req.query); // We don't set the parameters here in find() function, rather,
      // const tours = await Tour.find(queryObj); // We don't set the parameters here in find() function, rather,
      // const query = Tour.find(queryObj); // We don't set the parameters here in find() function, rather,
      let query = Tour.find(JSON.parse(queryStr)); // We don't set the parameters here in find() function, rather,
      // all the search query parameters are available in URL in Postman. From there, we can set all the parameters!

      // NOTE: we added now the price less than 1500 to the URL Search Query and it works fine
      // we can also add more search query to the URL like price in Postman URL
      // 127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5&price[lt]=1500

      // Regular expression: \b: means we want only these
      // four word and not these four words inside other words!
      // g means it replace for all these four word and not only the first one!

      // 2) Sorting in an Ascending Order: 127.0.0.1:3000/api/v1/tours?sort=price
      // Sorting in a descending Order: 127.0.0.1:3000/api/v1/tours?sort=-price
      if (req.query.sort) {
         // how to bring the search query items together with space instead of comma:
         const sortBy = req.query.sort.split(',').join(' ');
         console.log(sortBy); // -price -ratingsAverage
         // 127.0.0.1:3000/api/v1/tours?sort=-price,-ratingsAverage
         // query = query.sort(req.query.sort);
         query = query.sort(sortBy);
         // console.log(query);

         // sort('price ratingsAverage')
      } else {
         query = query.sort('-createdAt');
      }

      // 3) Field limiting
      // NOTE: this is our URL in Postman:
      // 127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price
      // 127.0.0.1:3000/api/v1/tours?fields=-name,-duration => it gives us all the items in
      // a tour except name and duration in Postman, because they are minus signs beside them.
      // and we see only these four fields in Postman as result plus _id and without --v.
      // when we remove all the search queries and our URL in postman is like this:
      // 127.0.0.1:3000/api/v1/tours => the compiler goes to the else section and we will
      // not have the --v anymore!
      if (req.query.fields) {
         const fields = req.query.fields.split(',').join(' '); //this will produce:name duration price
         // query = query.select('name duration price');
         query = query.select(fields); // to use this field!
      } else {
         query = query.select('-__v'); // we exclude this item(version=> __v)
      }

      // 4) Pagination: 127.0.0.1:3000/api/v1/tours?page=2&limit=10
      const page = req.query.page * 1 || 1; // we say page number one is default value in JS!
      const limit = req.query.limit * 1 || 100; // default value for limit would be 100!
      const skip = (page - 1) * limit; // for page No.3 => skip = (3-1)*10=20 and we skip 20 results
      // and page No.3 starts from result 21.
      // NOTE: page=2&limit=10 => user wants page Number 2 and 10 results per page!
      // 1-10 => page 1, 11-20 => page 2, 21-30 => page 3, ...
      // skip(10) means 10 items in first page has to be skipped to arrive to the second page!
      // but when we say page=3&limit=10, we have to set skip for 20 => skip(20), after 20 items
      // we will achieve third page!
      // query = query.skip(10).limit(10);
      query = query.skip(skip).limit(limit);

      if (req.query.page) {
         const numTours = await Tour.countDocuments();
         if (skip >= numTours) throw new Error('This page does not exist!');
         // NOTE: as soon as we get an Error, it goes out of try() block that we are now there
         // and will be in catch() section and shows the user the Error message!
      }

      // EXECUTE QUERY
      const tours = await query; // We have to write it in this way, otherwise, it will not work!
      // query.sort().select().skip().limit()
      // console.log(req.query, queryObj); // what we have in URL as SEARCH QUERY:
      // 127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy
      // { duration: '5', difficulty: 'easy' }
      // NOTE: GETTING ALL TOURS USING find()-- no need to make a new instance(object) and using
      // save() function too!
      // const tours = await Tour.find();

      // NOTE: THE FIRST METHOD TO WRITE THE SEARCH QUERY:
      // const tours = await Tour.find({
      //    duration: 5,
      //    difficulty: 'easy',
      // });

      // NOTE: THE SECOND METHOD TO WRITE THE SEARCH QUERY:
      // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
      // const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

      const Result = tours.length;
      // console.log(tours);
      // NOTE: 5) The best and cheap five tours:
      // 127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price
      // ratingsAverage is sorted descending due to -(minus) sign from biggest to smallest!
      // NOTE: 6) The cheapest and best five tours:
      // 127.0.0.1:3000/api/v1/tours?limit=5&sort=price,-ratingsAverage
      // price is sorted in Ascending manner => from smallest price to highest price!
      // -ratingsAverage doesn't work anymore, because price comes first.

      // 3 - SEND RESPONSE
      res.status(200).json({ status: 'success', Results: Result, AllTours: tours });
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
