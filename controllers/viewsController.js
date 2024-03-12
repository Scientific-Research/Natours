const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
   // 1) Get tour data from collection:
   const tours = await Tour.find();
   //  console.log(tours);

   // 2) Build template

   // 3) Render that template using tour data from 1)

   res.status(200).render('overview', {
      title: 'All Tours',
      tours: tours,
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

   // 2) Build template

   // 3) Render template using data from 1)

   res.status(200).render('tour', {
      title: 'The Forest Hiker Tour',
      tour: tour,
   });
});
