const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection:
  const tours = await Tour.find();
  //  console.log(tours);

  // 2) Build template

  // 3) Render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours // we use this "tours" in overview.pug
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  // const slug = req.params.slug;
  // console.log(slug);

  // 1) Get the data, for the requested tour (including reviews and tour guides)
  // const tour = await Tour.findOne((t) => t.slug === slug); => THIS IS FALSE
  const tour = await Tour.findOne({
    slug: req.params.slug
  }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  // console.log(tour);

  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    // title: 'The Forest Hiker Tour',
    title: tour.name,
    tour: tour // we use this "tour" in tour.pug
  });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up for an account'
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) first, find all the tours for currently logged in user that has already booked! => find all bookings:
  const bookings = await Booking.find({
    user: req.user.id
  });
  // 2) Find tours with the returned IDs:
  const tourIDs = bookings.map(el => el.tour); // map gives us an array of tourIDs
  const tours = await Tour.find({
    _id: {
      $in: tourIDs
    }
  });

  // NOTE: we have our tours now to be rendered:
  res.status(200).render('overview', {
    // we don't define a new pug template, rather, we reuse the overview template which we used it already to display all the Tours.
    // the only difference is: we show here only the tours that user already booked! and not all the tours!
    title: 'My Tours',
    tours: tours
  });
});
exports.updateUserData = catchAsync(async (req, res, next) => {
  // NOTE: console.log(`UPDATING USER: ${req.body}`); // this will not work!!!
  // NOTE: console.log('UPDATING USER:' + req.body); // this will not work too!!!
  console.log('UPDATING USER:', req.body); // NOTE: this only works!!! => only works with comma!!!!

  // NOTE: because we protected this route using protect, we have access to the currentUser via req.user.id => req.user = currentUser; res.locals.user = currentUser;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    // name is already there in html => account.pug
    email: req.body.email // name is alread there in html => account.pug
  }, {
    new: true,
    runValidators: true
  });
  // after submitting data, we want to back to the same page and new data should remain there in its fields! => we have to render acount page again:
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser // we have to specify the user with new one!
  });
});