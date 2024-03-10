// const fs = require('fs');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
   // All fields have to be in String format! here we have a prefilling process before
   // go to the getAllTours() function!
   // we have here the prices sorted in Ascending manner with ratingAverage sorted in descending manner!
   req.query.limit = '5';
   req.query.sort = 'price,-ratingsAverage'; // sorted with price
   // req.query.sort = '-ratingsAverage,price'; // sorted with ratingsAverage
   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
   next();
};

// const getAllTours = (req, res,next) => {
// 127.0.0.1:3000/api/v1/tours?difficulty=easy&sort=1&duration[gte]=5&price[lt]=1500&limit=5

// NOTE: replacing the getAllTours with a generalfunction from handlerFactory.js
// that's why i commented the below function out!
exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // try {
//   // console.log(req.query);
//   // 1 - BUILD QUERY
//   // 1A) Filtering
//   // const queryObj = { ...req.query }; // we made a copy of the req.query and converted it to an Object!
//   // const excludedFields = ['page', 'sort', 'limit', 'fields'];

//   // Remove all these excluded fields from queryObj: => we don't need to have a new array, that's why we use FOREACH:
//   // excludedFields.forEach((el) => delete queryObj[el]);

//   // 1B) Advanced filtering:
//   // NOTE: Exercise: {difficulty:'easy', duration:{$gte:5}}
//   // we can do all these using replace() => gte, gt, lte, lt using regular expression
//   // In Postman: 127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5
//   // In VSCode Terminal:console.log(req.query)=>{ difficulty: 'easy', duration: { gte: '5' } }
//   // console.log('queryObj' + queryObj);
//   // let queryStr = JSON.stringify(queryObj);
//   // console.log('queryStr' + queryStr);
//   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   // console.log(JSON.parse(queryStr)); // we want the Object here!

//   // NOTE: THIS IS THE THIRD METHOD TO WRITE A SEARCH QUERY:
//   // const tours = await Tour.find(req.query); // We don't set the parameters here in find() function, rather,
//   // const tours = await Tour.find(queryObj); // We don't set the parameters here in find() function, rather,
//   // const query = Tour.find(queryObj); // We don't set the parameters here in find() function, rather,
//   // let query = Tour.find(JSON.parse(queryStr)); // We don't set the parameters here in find() function, rather,
//   // all the search query parameters are available in URL in Postman. From there, we can set all the parameters!

//   // NOTE: we added now the price less than 1500 to the URL Search Query and it works fine
//   // we can also add more search query to the URL like price in Postman URL
//   // 127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5&price[lt]=1500

//   // Regular expression: \b: means we want only these
//   // four word and not these four words inside other words!
//   // g means it replace for all these four word and not only the first one!

//   // // 2) Sorting in an Ascending Order: 127.0.0.1:3000/api/v1/tours?sort=price
//   // // Sorting in a descending Order: 127.0.0.1:3000/api/v1/tours?sort=-price
//   // if (req.query.sort) {
//   //    // how to bring the search query items together with space instead of comma:
//   //    const sortBy = req.query.sort.split(',').join(' ');
//   //    console.log(sortBy); // -price -ratingsAverage
//   //    // 127.0.0.1:3000/api/v1/tours?sort=-price,-ratingsAverage
//   //    // query = query.sort(req.query.sort);
//   //    query = query.sort(sortBy);
//   //    // console.log(query);

//   //    // sort('price ratingsAverage')
//   // } else {
//   //    query = query.sort('-createdAt');
//   // }

//   // // 3) Field limiting
//   // // NOTE: this is our URL in Postman:
//   // // 127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price
//   // // 127.0.0.1:3000/api/v1/tours?fields=-name,-duration => it gives us all the items in
//   // // a tour except name and duration in Postman, because they are minus signs beside them.
//   // // and we see only these four fields in Postman as result plus _id and without --v.
//   // // when we remove all the search queries and our URL in postman is like this:
//   // // 127.0.0.1:3000/api/v1/tours => the compiler goes to the else section and we will
//   // // not have the --v anymore!
//   // if (req.query.fields) {
//   //    const fields = req.query.fields.split(',').join(' '); //this will produce:name duration price
//   //    // query = query.select('name duration price');
//   //    query = query.select(fields); // to use this field!
//   // } else {
//   //    query = query.select('-__v'); // we exclude this item(version=> __v)
//   // }

//   // // 4) Pagination: 127.0.0.1:3000/api/v1/tours?page=2&limit=10
//   // const page = req.query.page * 1 || 1; // we say page number one is default value in JS!
//   // const limit = req.query.limit * 1 || 100; // default value for limit would be 100!
//   // const skip = (page - 1) * limit; // for page No.3 => skip = (3-1)*10=20 and we skip 20 results
//   // // and page No.3 starts from result 21.
//   // // NOTE: page=2&limit=10 => user wants page Number 2 and 10 results per page!
//   // // 1-10 => page 1, 11-20 => page 2, 21-30 => page 3, ...
//   // // skip(10) means 10 items in first page has to be skipped to arrive to the second page!
//   // // but when we say page=3&limit=10, we have to set skip for 20 => skip(20), after 20 items
//   // // we will achieve third page!
//   // // query = query.skip(10).limit(10);
//   // query = query.skip(skip).limit(limit);

//   // if (req.query.page) {
//   //    const numTours = await Tour.countDocuments();
//   //    if (skip >= numTours) throw new Error('This page does not exist!');
//   //    // NOTE: as soon as we get an Error, it goes out of try() block that we are now there
//   //    // and will be in catch() section and shows the user the Error message!
//   // }

//   // EXECUTE QUERY
//   // make new instance(Object) from class and send two parameters: query and queryStr to constructor!
//   // NOTE: we can write the methods like chain here because of "this" word in => return this,
//   // it sends always entire object to the next method and at the end we have the entire processed
//   // Object after filtering, sorting, limitfields and pagination:
//   // NOTE: I only added this section to above code, to display complete info for every user and not only _id:
//   // NOTE: I commented this out, because I want to do that using query middleware in tourModel.js - it will prevent us from repeating the code! DRY = Don't repeat Yourself!
//   /**
//    * .populate({
//   path: 'guides',
//   select: '-__v -passwordChangedAt', // - means deselect, but of course, only in guides array!
// });
// */
//   //   const features = new APIFeatures(
//   //     Tour.find().populate({
//   //       path: 'guides',
//   //       select: '-__v -passwordChangedAt', // - means deselect, but of course, only in guides array!
//   //     }),
//   //     req.query
//   //   )
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .pagination();
//   // features.filter();
//   // features.sort();
//   // const tours = await query; // We have to write it in this way, otherwise, it will not work!
//   const tours = await features.query; // We have to write it in this way, otherwise, it will not work!
//   // query.sort().select().skip().limit()
//   // console.log(req.query, queryObj); // what we have in URL as SEARCH QUERY:
//   // 127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy
//   // { duration: '5', difficulty: 'easy' }
//   // NOTE: GETTING ALL TOURS USING find()-- no need to make a new instance(object) and using
//   // save() function too!
//   // const tours = await Tour.find();

//   // NOTE: THE FIRST METHOD TO WRITE THE SEARCH QUERY:
//   // const tours = await Tour.find({
//   //    duration: 5,
//   //    difficulty: 'easy',
//   // });

//   // NOTE: THE SECOND METHOD TO WRITE THE SEARCH QUERY:
//   // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
//   // const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

//   const Result = tours.length;
//   // console.log(tours);
//   // NOTE: 5) The best and cheap five tours:
//   // 127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price
//   // ratingsAverage is sorted descending due to -(minus) sign from biggest to smallest!
//   // NOTE: 6) The cheapest and best five tours:
//   // 127.0.0.1:3000/api/v1/tours?limit=5&sort=price,-ratingsAverage
//   // price is sorted in Ascending manner => from smallest price to highest price!
//   // -ratingsAverage doesn't work anymore, because price comes first.

//   // 3 - SEND RESPONSE
//   res.status(200).json({ status: 'success', Results: Result, AllTours: tours });
//   // }
//   // catch (err) {
//   //    console.log('Error to get all the tours from MongoDB!' + err.message);
//   //    res.status(400).json({ status: 'fail', message: err.message });
//   // }

//   // console.log(req.requestTime);
//   // res.status(200).json({
//   //    status: 'success',
//   //    requestedAt: req.requestTime,
//   //    // results: tours.length,
//   //    // tours,
//   // });
//   // // next();
// });

// NOTE: i use the getOne() function in handlerFactory.js here as a general function for all the documents, that's whx i cokment the below function out:

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// exports.getTour = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   // to populate a field, we have to add populate and the related filed:
//   // populate means to fill up the field guides in our model in tourModel.js
//   // NOTE: our current guides filed has only our ref to User which show us the IDs from users but with populate we want to fill it up with actuall data and it would be only in the query and not in the database!
//   // In Postman => Get with Id => {{URL}}api/v1/tours/65e8788d29cf25cffa22716c
//   // and then we will get the Info about users with these two IDs in details.
//   // NOTE: when we want to say, we want some fields and we don't want some other fields:
//   // const tour = await Tour.findById(id).populate('guides');
//   //   const tour = await Tour.findById(id).populate({
//   //     path: 'guides',
//   //     select: '-__v -passwordChangedAt', // - means deselect, but of course, only in guides array!
//   //   });
//   // NOTE: WE DON'T NEED TO ABOVE POPULATE STATEMENTS ANYMORE; BECAUSE I DEFINED IT AS A QUERY MIDDLEWARE IN tourModel.js AND GET ALL TOUR USE THAT TOO. SO, I DON'T NEED TO REAPEAT IT AGAIN! I WROTE IT AS QUERY MIDDLEWARE ONLY ONE TIME AND ALL OTHER QUERY CAN USE IT! SO, I BACK TO THE BELOW STATEMENT WITHOUT POPULATE:
//   // const tour = await Tour.findById(id);
//   // NOTE: we add populate to display the reviews for every tour, when we get one tour in Postman!
//   // in Postman: {{URL}}api/v1/tours/5c88fa8cf4afda39709c2951
//   const tour = await Tour.findById(id).populate('reviews');
//   console.log(id);

//   // NOTE: what we have to do if we have an invalid id => 404 => Page Not Found!
//   // There is no tour => it means null => In JS, null is falsy value and in if statement,
//   // it will convert to false value:
//   if (!tour) {
//     // when we give parameters to next(), it means an error happened and we give our global
//     // Error App => AppError() function as this parameter and it has itself two parameters:
//     // message and statusCode and we have to use return to send it back and not going forward!
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   // try {
//   // NOTE: GETTING ONLY ONE TOUR USING findById(id)-- no need to make a new instance(object) and using
//   // save() function too!
//   // NOTE: Tour.findOne({_id: req.params.id})
//   console.log(tour);
//   res.status(200).json({ status: 'success', OneTour: tour });
//   // } catch (err) {
//   //    console.log('Error to get one tour from MongoDB!' + err.message);
//   //    res.status(400).json({ status: 'fail', message: err.message });
//   // }

//   // const id = req.params.id;
//   // console.log('id: ' + id);

//   // try {
//   //    // console.log('Tours length: ' + tours.length);
//   //    // const tour = tours.find((item) => item.id === parseInt(id));
//   //    // if (!tour) throw new Error('Invalid ID! Please try again later!');
//   //    // console.log(tour);
//   //    // res.status(200).json({
//   //    //    status: 'success',
//   //    //    tour,
//   //    // });
//   // } catch (err) {
//   //    res.status(404).json({
//   //       status: 'fail',
//   //       message: err.message,
//   //    });
//   // }
// });

// NOTE: using factoryHandlet to create the general createTour function here, that's why i commented the below create function out!
exports.createTour = factory.createOne(Tour);

// exports.createTour = catchAsync(async (req, res, next) => {
//   // const newTour = req.body;
//   // console.log(newTour);
//   // NOTE: THIS IS THE FIRST METHOD TO CREATE THE DATA. In this method, we make a new instance(object)
//   // from Tour but in the next method, we use Tour direct with create(), that's why don't need
//   // to create a new instance of Tour. In addition to that, we don't need to use save().
//   // try {
//   //    const tour = new Tour({
//   //       name: 'Test Tour-5',
//   //       rating: 4.7,
//   //       price: 997,
//   //    });
//   //    const doc = await tour.save();
//   //    console.log(doc);
//   //    res.status(201).json({
//   //       status: 'success',
//   //       createdTour: doc,
//   //    });
//   // } catch (err) {
//   //    console.log(`Error creating the tour data on MongoDB: ${err.message}`);
//   //    res.status(404).json({ message: 'Error creating the tour data on MongoDB!' });
//   // }

//   // NOTE: THIS IS THE SECOND METHOD TO CREATE THE DATA, when we use create() function, we
//   // don't need to make a new instance(object) from Tour and also we don't need to use save()
//   // function anymore. But in first method, we have to use both of them!

//   // const newTour = await Tour.create({
//   //    name: 'Test Tour-6',
//   //    rating: 4.7,
//   //    price: 997,
//   // });
//   const newTour = await Tour.create(req.body); // recieve the data from Postman
//   // doc = await newTour.save();
//   console.log(newTour);
//   res.status(201).json({
//     status: 'success',
//     createdTour: newTour,
//   });

//   // try {

//   // } catch (err) {
//   //    console.log(`Error creating the tour data on MongoDB: ${err.message}`);
//   //    // res.status(400).json({ status: 'fail', message: 'Error creating the tour data on MongoDB!' });
//   //    res.status(400).json({ status: 'fail', message: err.message });
//   // }

//   // const id_1 = tours.length - 1;
//   // const newId = id_1 + 1;
//   // const newTour = req.body;
//   // newTour.id = newId;
//   // console.log(newTour);
//   // tours.push(newTour);
//   // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
//   //    res.status(201).json({
//   //       status: 'success',
//   //       tours: newTour,
//   //    })
//   // );
// });

// NOTE: using updateOne in general handlerFactory instead of this updateTour:
exports.updateTour = factory.updateOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const id = req.params.id;

//   // try {
//   const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
//     new: true, // to send the new(updated) tour to the client.
//     runValidators: true,
//   });

//   if (!updatedTour) {
//     // when we give parameters to next(), it means an error happened and we give our global
//     // Error App => AppError() function as this parameter and it has itself two parameters:
//     // message and statusCode and we have to use return to send it back and not going forward!
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   console.log(updatedTour);
//   res.status(200).json({
//     status: 'success',
//     updatedTour: updatedTour,
//   });
//   // } catch (err) {
//   //    console.log('Error updating the Tour!' + err.message);
//   //    res.status(400).json({ status: 'fail', message: err.message });
//   // }

//   // try {
//   //    const tour = tours.find((item) => item.id === parseInt(id));
//   //    if (!tour) throw new Error('Invalid ID! Please try again later!');
//   //    console.log('Before Patch => Updating');
//   //    console.log(tour);

//   //    const newTour = req.body;

//   //    newTour.id = parseInt(id);
//   //    let toursId = tours.indexOf(tours[id]);
//   //    tours[toursId] = newTour;

//   //    console.log('After Patch => Updating');
//   //    console.log(newTour);

//   //    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
//   //       res.status(201).json({
//   //          status: 'success',
//   //          tours: newTour,
//   //       })
//   //    );
//   // } catch (err) {
//   //    res.status(404).json({
//   //       status: 'fail',
//   //       message: err.message,
//   //    });
//   // }
// });

// NOTE: we comment this delete middleware function here out and use our HANDLERFACTORY function here.
exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const id = req.params.id;

//   // try {
//   const deletedTour = await Tour.findByIdAndDelete(id);

//   if (!deletedTour) {
//     // when we give parameters to next(), it means an error happened and we give our global
//     // Error App => AppError() function as this parameter and it has itself two parameters:
//     // message and statusCode and we have to use return to send it back and not going forward!
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   if (!deletedTour) throw new Error('This Tour already deleted!');
//   console.log(deletedTour);

//   res.status(200).json({
//     status: 'success',
//     deletedTour: deletedTour,
//   });
// } catch (err) {
//    console.log('Error deleting the tour data: ' + err.message);
//    res.status(400).json({ status: 'fail', message: err.message });
// }

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
// });

// NOTE: Strat using aggregation Pipeline: a function does some statistics and we will create
// a rour for that later!
// Aggregation pipeline is a mongoDB feature which is accessible through mongoose driver!
exports.getTourStats = catchAsync(async (req, res, next) => {
   // try {
   const stats = await Tour.aggregate([
      // we pass here an array of stages:
      // first stage: match, each stage is an object:
      {
         $match: { ratingsAverage: { $gte: 4.5 } },
      },
      // second stage is group:
      {
         $group: {
            // group the documents using accumulators:
            // _id: null, // we want to calculate avarages for all groups, that's why is is null
            _id: { $toUpper: '$difficulty' }, // we want to calculate avarages for all groups, that's why is is null
            // _id: '$ratingsAverage', // we want to calculate avarages for all groups, that's why is is null
            // and we don't write name of a document here!
            numTours: { $sum: 1 }, // to calculate the number of Tours
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
         },
      },
      // and the third stage is sort:
      {
         $sort: { avgPrice: 1 }, // 1: means Ascending and -1: means Descending
      },
      // {
      //    // we can repeat the stage for second time like match here!
      //    $match: { _id: { $ne: 'EASY' } }, // the id is difficulty above! ne: not equal to easy
      //    // it means, it will select us the medium and difficult documents! is excluding easy doc.
      // },
   ]);
   res.status(200).json({
      status: 'success',
      Statistics: stats,
   });
   // } catch (err) {
   //    console.log('Error getting Tour Statistics data! : ' + err.message);
   //    res.status(400).json({ status: 'fail', message: err.message });
   // }
});

// NOTE: we have a new function here to get the monthly plan according to the year!
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
   // try {
   const year = req.params.year * 1; // => 2021 getting year parameter from URL and covert it to number!

   const plan = await Tour.aggregate([
      // define a new object and the corresponding stage:
      // with this stage, we have 27 repeated Tour with separated startDates,
      // it means: 9 Tour * 3 startDates for each of them.
      {
         $unwind: '$startDates',
      },
      // match stage is used to select a date here => startDate
      {
         $match: {
            startDates: {
               // we want to see our Tours in One year => 365 days! between first and last day
               // of current year!
               // 127.0.0.1:3000/api/v1/tours/monthly-plan/2021 => 18 Tours
               // 127.0.0.1:3000/api/v1/tours/monthly-plan/2022 => 8 Tours
               // 127.0.0.1:3000/api/v1/tours/monthly-plan/2023 => 1 Tour
               // 127.0.0.1:3000/api/v1/tours/monthly-plan/2024 => NO Tour => empty Array
               $gte: new Date(`${year}-01-01`), // 01.01.2021
               $lte: new Date(`${year}-12-31`), // 31.12.2021
            },
         },
      },
      {
         $group: {
            // we extract the month from start Date - we are grouping by the month
            _id: { $month: '$startDates' },
            numTourStarts: { $sum: 1 },
            // we want to have more information, not only how many tours, rather, which tours:
            // we push the name of the Tours in an array: specify two three different tours in
            // one place: we use array!
            tourNames: { $push: '$name' },
         },
      },
      {
         // NOTE: this stage add fields
         $addFields: {
            month: '$_id',
         },
      },
      {
         // NOTE: the next stage is project: 0: it doesn't show value, 1: it shows the value!
         $project: {
            _id: 0,
         },
      },
      {
         // i use already the sort and i use it again now!
         $sort: { numTourStarts: -1 }, // -1 is for descending => starting with highest number
         // result: July is busiest month with 3 Tours starts!
      },
      {
         // this stage allows us to have only 6 outputs => we will have 6 objects at output!
         // $limit: 6, it doesn't show us the complete list of numbers of tours
         $limit: 12,
      },
   ]);
   res.status(200).json({
      status: 'success',
      plan_Length: plan.length,
      Plan: plan,
   });
   // } catch (err) {
   //    console.log('Error getting Monthly Plan Data: ' + err.message);
   //    res.status(400).json({ status: 'fail', message: err.message });
   // }
});

/* 
// NOTE: we want to pass the coordinates where you are!
router.route('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);
// /tours-within/233/center/34.111745,-118.113491/unit/mi => we use this way which is more cleaner! */
// TWO ROUTE EXAMPLES IN POSTMAN:
// {{URL}}api/v1/tours/tours-within/400/center/34.111745,-118.113491/unit/mi => 400 miles from Los Angeles
// {{URL}}api/v1/tours/tours-within/200/center/34.111745,-118.113491/unit/mi => 200 miles from Los Angeles
exports.getToursWithin = catchAsync(async (req, res, next) => {
   const { distance, latlng, unit } = req.params;

   // to get the coordinated from latitude and langitude in a format like this: 34.111745,-118.113491
   // split needs string content which latlng has!
   const [lat, lng] = latlng.split(','); // => this produces an array of two elements

   // define radius:
   const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

   if (!lat || !lng) {
      next(new AppError('Please provide latitude and longitude in this format: lat,lng.', 400));
   }

   const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
   });

   console.log(distance, lat, lng, unit);

   res.status(200).json({
      status: 'success',
      results: tours.length,
      Geolocation: tours,
   });
});
