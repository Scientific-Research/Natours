const express = require('express');

const router = express.Router();

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('../routes/reviewRoutes');

// router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and the price property
// if not, send back 400 (bad request)
// Add it to the post handler stack

// using destructuring:
// const { getAllTours, getTour, createTour, updateTour, deleteTour, checkBody } = tourController;

////////////////////////////////////////// Using merge Params //////////////////////////
// NOTE: whenever you find a route like this in Postmann, goes to reviewRouter function() and run this function!
// POST /tour/65342wer/reviews => it goes first of all to => app.use('/api/v1/tours', tourRouter); because /tours is there and then goes to the => tourRouter, after that it goes comes to the => /:tourId/reviews and at the end, it goes to the => reviewRouter.
// NOTE: we have to make it possible, that reviewRouter can access to the tourId => we have to go to the reviewRouter.js and then magic of merge params comes into play!
router.use('/:tourId/reviews', reviewRouter);

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = tourController;

const { protect, restrictTo } = authController;
// const { createReview } = reviewController;

// 127.0.0.1:3000/api/v1/tours/top-5-cheap
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// NOTE: adding Tour for Statistics using Aggregation Pipeline:
router.route('/tour-stats').get(getTourStats);

// NOTE: adding a new route for getting monthly plan:
router.route('/monthly-plan/:year').get(getMonthlyPlan);

// tourRouter.route('/api/v1/tours').get(getAllTours).post(createTour);
// router.route('/').get(getAllTours).post(checkBody, createTour);

// NOTE: we use a middleware function here to protect the route to run BEFORE each
// of these handler functions here is: getAllTours =>
// this middleware will return an error when the user is not logged in and therefore,
// getAllTours which is the middleware beside it, will not be executed!
// when user is logged in already, protect function will not issue an error and therefore,
// the getAllTours which is the middleware beside it, will run and user can see all the tours!
// In this way, it will protect the route from unauthorized access!
// NOW, we have to create this middleware in authController.js and then put it here beside
// getAllTours => (THIS CREATED MIDDLEWARE => protect, getAllTours)
// router.route('/').get(protect, getAllTours).post(createTour);

// NOTE: i removed the protect from below route to access any person from all over the world to see the list of all tours available in our website and not only the logged in people!
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
// WHEN CHECKBODY IS TRUE, ROUTER GOES TO THE CREATETOUR(); OTHERWISE, IT SHOWS US THE
// BODY CHECK ERROR!
// tourRouter.route('/').get(getAllTours).post(createTour);
// this only for get() => one item, patch() and delete()
// tourRouter.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

router
  .route('/:id')
  // here, everybody can show a single tour!
  .get(getTour)
  // but only logged in persons that are admin or lead-guide, can edit the tour!
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  // NOTE: for deleteTour, first of all, we check if he is logged in! that's why we use protect
  // as our middleware here! => this is authentication
  // after that when a person is already logged in, we check if he is allowed to delete a tour or
  // not? we say here only admin and lead-guide can do that, that's why it is only restricted
  // to admin and lead-guide! A normal user or we say just a user is not in this list,
  // therefore, he is not allowed to delete something!
  // but only logged in persons that are admin or lead-guide can delete a tour!
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

///////////////////////////////////////////NESTED ROUTES///////////////////
// NOTE: this is an example of nested Route: to create a new Review, we need two IDs: one for user and the second one for tour: the first ID for user is there anyway, when user is logged in and the second one which is ID for tour, we write it in the Route as following:
// There is a parent child relationship here: reviews is child of tour as parent here!
// it means we access reviews on the tour!

// NOTE: POST /tour/65342wer/reviews =>/tour is already mounted in app.js, we don't need to repeat it again here:
// :tourId => 65342wer
// NOTE: but anyway, we will use another new feature in Mongoose, it called merge params and we don't need to use below nested route anymore! That's why i will comment it out!
// because actually below nested route is related to the review and not tour, that's why it is not a good place here to write this nested route here!
// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

// NOTE: get all the reviews from this tour with this ID for us!
// GET /tour/65342wer/reviews

// NOTE: one step further: we can get the specific review with its ID(095687lhjg) from a specific tour with its ID(65342wer).
// GET /tour/65342wer/reviews/095687lhjg

module.exports = router;
