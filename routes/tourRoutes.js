const express = require('express');

const router = express.Router();

const tourController = require('../controllers/tourController');

router.param('id', tourController.checkID);

// using destructuring:
const { getAllTours, getTour, createTour, updateTour, deleteTour } = tourController;
// tourRouter.route('/api/v1/tours').get(getAllTours).post(createTour);
router.route('/').get(getAllTours).post(createTour);
// tourRouter.route('/').get(getAllTours).post(createTour);
// this only for get() => one item, patch() and delete()
// tourRouter.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
