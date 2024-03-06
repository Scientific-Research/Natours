const mongoose = require('mongoose');

// review / rating / createdAt / ref to tour / ref to user
const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty!'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // NOTE: writing the PARENT REFERENCING:
  // Each review document now knows exactly to which tour belong to!
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour!'],
  },
  // who wrote this review => we need to write the Parent referencing for the user too!
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user!'],
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
