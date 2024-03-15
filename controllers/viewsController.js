const Tour = require('../models/tourModel');
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
      tours: tours, // we use this "tours" in overview.pug
   });
});

exports.getTour = catchAsync(async (req, res, next) => {
   // const slug = req.params.slug;
   // console.log(slug);

   // 1) Get the data, for the requested tour (including reviews and tour guides)
   // const tour = await Tour.findOne((t) => t.slug === slug); => THIS IS FALSE
   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user',
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
      tour: tour, // we use this "tour" in tour.pug
   });
});

exports.getLoginForm = (req, res) => {
   res.status(200).render('login', {
      title: 'Log into your account',
   });
};

exports.getAccount = (req, res) => {
   res.status(200).render('account', {
      title: 'Your account',
   });
};

exports.UpdateUserData = (req, res, next) => {
   console.log('UPDATING USER: ' + req.body);
};
