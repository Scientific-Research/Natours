const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
   // 1) Get the currently booked tour
   const tourId = req.params.tourId;
   //  const tour = await Tour.find((tour) => tourId === req.tour.id);
   const tour = await Tour.findById(tourId); // NOTE: findById needs only an id and not two Ids with a equal sign in between!

   // 2) Create checkout session

   // 3) Create session as response and send it to the client
});
