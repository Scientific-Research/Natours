const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');

// NOTE: replacing getAllReviews function with getAll() function in handlerFactory.js, that's why i commented this getAllReviews out.
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   // NOTE: GET /tour/5c88fa8cf4afda39709c2951/reviews
//   // Something like this in Postman: {{URL}}api/v1/tours/5c88fa8cf4afda39709c2951/reviews
//   // This is tourId that I need: 5c88fa8cf4afda39709c2951 to put between /tours/ and
//   // /reviews

//   const tourId = req.params.tourId;
//   let filter;
//   if (tourId) {
//     // we need review in which tour: 5c88fa8cf4afda39709c2951 which is tourId!
//     filter = { tour: tourId };
//   }
//   // an then we say to find, please find this review with such tourId!
//   const reviews = await Review.find(filter);

//   // const reviews = await Review.find();

//   res.status(200).json({
//     status: 'success',
//     Length: reviews.length,
//     reviews: reviews,
//   });
// });

// NOTE: first of all, we have to create a middleware to run before our createOne in handlerFactory executes. This middleware is for these two statements, because they run before Review.create() function runs! this two below statements are not available in createOne in handlerFactory, that's why we have to run them separately in a function before the createTour function runs!
// if (!req.body.tour) req.body.tour = req.params.tourId;
// if (!req.body.user) req.body.user = req.user.id;
// we will add this function in reviewRoutes.js
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//   // NOTE: Allow nested routes:
//   // req.body.tour => tour here means id from this tour
//   // req.body.user => user here means id from this user
//   // both of these two fields: tour and user as IDs are required fields in Postman, as we specified them as required in reviewModel.js and when we want to create a review!
//   // if (!req.body.tour) req.body.tour = req.params.tourId;
//   // if (!req.body.user) req.body.user = req.user.id; // in protect function, req takes the id from current user! =>  req.user = currentUser;

//   // NOTE: when we don't assign IDs to tour and user in Postman or there is no IDs for them at all, they will get them from tourId and id!

//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     newReview: newReview,
//   });
// });

// NOTE: That's all what we have to do to delete a review using factory general function!
// we use this factory function to delete all kinds of documents: tour, review, user ...
// The next step is to create the route for this delete in reviewRoute.js
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review); // I commented the above createReview function out to use the general createOne() function in factory file.
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);