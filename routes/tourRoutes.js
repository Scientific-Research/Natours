const express = require('express');

const router = express.Router();

const tourController = require('../controllers/tourController');

// router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and the price property
// if not, send back 400 (bad request)
// Add it to the post handler stack

// using destructuring:
// const { getAllTours, getTour, createTour, updateTour, deleteTour, checkBody } = tourController;
const { getAllTours, getTour, createTour, updateTour, deleteTour } = tourController;
// tourRouter.route('/api/v1/tours').get(getAllTours).post(createTour);
// router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/').get(getAllTours).post(createTour);
// WHEN CHECKBODY IS TRUE, ROUTER GOES TO THE CREATETOUR(); OTHERWISE, IT SHOWS US THE
// BODY CHECK ERROR!
// tourRouter.route('/').get(getAllTours).post(createTour);
// this only for get() => one item, patch() and delete()
// tourRouter.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
