const mongoose = require('mongoose');

// review / rating / createAt / ref to tour / ref to user
const tourReview = mongoose.Schema({
  review: {
    type: String,
    terim: true,
    maxLength: [40, 'A tour name must have less or equal than 40 Characters'],
    minLength: [10, 'A tour name must have more or equal than 10 Characters'],
  },
  rating: {
    type: Number,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  guides: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    ref: 'User',
  },
});

const tour = mongoose.model(tourReview, 'Review');

module.exports = tour;
