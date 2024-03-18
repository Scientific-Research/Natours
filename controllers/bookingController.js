const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
   const session = await stripe.checkout.session.create({
      // This part is the information about session itself
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email: req.user.email, // user is already at request, because the route is protected!
      client_reference_id: tourId,
      // This is the information about session itself

      // This part is information about product that user is going to purchase!
      line_items: [
         {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
            amount: tour.price * 100,
            currency: 'usd',
            quantity: 1,
         },
      ],
   });

   // 3) Create session as response and send it to the client
});
