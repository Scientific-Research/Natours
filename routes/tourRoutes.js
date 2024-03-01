const express = require('express');

const router = express.Router();

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

// router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and the price property
// if not, send back 400 (bad request)
// Add it to the post handler stack

// using destructuring:
// const { getAllTours, getTour, createTour, updateTour, deleteTour, checkBody } = tourController;
const { getAllTours, getTour, createTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan } =
   tourController;

const { protect } = authController;

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
router.route('/').get(protect, getAllTours).post(createTour);
// WHEN CHECKBODY IS TRUE, ROUTER GOES TO THE CREATETOUR(); OTHERWISE, IT SHOWS US THE
// BODY CHECK ERROR!
// tourRouter.route('/').get(getAllTours).post(createTour);
// this only for get() => one item, patch() and delete()
// tourRouter.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
