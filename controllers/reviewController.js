const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    Length: reviews.length,
    reviews: reviews,
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // NOTE: Allow nested routes:
  // req.body.tour => tour here means id from this tour
  // req.body.user => user here means id from this user
  // both of these two fields: tour and user as IDs are required fields in Postman, as we specified them as required in reviewModel.js and when we want to create a review!
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id; // in protect function, req takes the id from current user! =>  req.user = currentUser;
  // NOTE: when we don't assign IDs to tour and user in Postman or there is no IDs for them at all, they will get them from tourId and id!

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    newReview: newReview,
  });
});
