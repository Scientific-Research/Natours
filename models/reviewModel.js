const mongoose = require('mongoose');

// review / rating / createdAt / ref to tour / ref to user
const reviewSchema = mongoose.Schema(
  {
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
  },
  {
    // NOTE: we have to say that we will need the Virtuals, when the data goes to be published at output!
    // when we have some virtual properties, it means the fields which are not stored in database, but are used to calculte other fields, we want to show them too up , when there is an output!
    toJSON: { virtuals: true }, // when the data outputted as JSON
    toObject: { virtuals: true }, // when the data outputted as Object
  }
);

// NOTE: we can also use pre query middleware and don't repeat again the populate code:
// this middleware populate the name and tour instead of their IDs for Reviews!
// we see now two IDs for user and tour, but after the population process, It will fill up the user and tour with respected names instead of their IDs.
reviewSchema.pre(/^find/, function (next) {
  // NOTE: we have to call the populate two times, one for tour and another one for user!
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo', // it must not leak the private infos from user - we just send the name and photos and not something else like email...
  // });

  // NOTE: we have to call the populate two times, one for tour and another one for user!
  // NOTE: Actually we don't need to populate the tour info in reviews section for one tour => that's why we omit the first path: 'tour' and therefore, we will have only info about user in reviews section for one tour and not for tour anymore!
  this.populate({
    path: 'user',
    select: 'name photo ', // it must not leak the private infos from user - we just send the name and photos and not something else like email...
    // select: '-__v',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
