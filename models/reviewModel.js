const mongoose = require('mongoose');
const Tour = require('./tourModel');
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

// NOTE: we want that one user can send only one comment for one tour!
// we use index feature in mongoose!
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

// NOTE: we want to calculate average of ratings in tours using mongoDB function(static method): statics
// NOTE: tour here means tourId
reviewSchema.statics.calcAverageRatings = async function (tourId) {
   // using Aggregation pipelines to do the calculations:
   // "this" points to model here and we call aggregate always on the model:
   const stats = await this.aggregate([
      // 1- select all the reviews which belong to the current tour which passed here as argument:
      {
         $match: { tour: tourId }, // we select the tour which we want to update!
      },
      {
         $group: {
            _id: '$tour', // we are grouping all the tours together by tour:
            nRating: { $sum: 1 }, // add one for the tour which matched from last step
            avgRating: { $avg: '$rating' }, // calculate the average of rating numbers
         },
      },
   ]);
   //  console.log(stats);

   // NOTE: Persist the stats data in databas in its tour instead of current default value:
   /**
     * [
  {
    _id: new ObjectId('65eba37e2c068a52a29c7cc4'),
    nRating: 3,
    avgRating: 4.333333333333333
  }
]
     */
   // NOTE: we have to add this if and else here because after deleeting the last document, the quantity and average will be null and we have replace them with default values in else setion.
   if (stats.length > 0) {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsQuantity: stats[0].nRating, // nRating is in null position
         ratingsAverage: stats[0].avgRating, // avgRating is in null position too!
      });
   } else {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsQuantity: 0, // nRating is in null position
         ratingsAverage: 4.5, // avgRating is in null position too!
      });
   }
};

// NOTE: to call the above function whenever a new document is created! => we use pre function middleware!
reviewSchema.post('save', function () {
   // this points to current review
   //  Review.calcAverageRatings(this.tour); // this doesn't work, because we are before Review and Review will be available down!
   this.constructor.calcAverageRatings(this.tour); // this works, instead of Review, we need to use this.constructor
   //  next(); post doesn't access to next() - we use the next() only for pre().
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
   // NOTE: after mongoose version 6, we will get this error: MongooseError: Query was already executed! to avoid that, we can do one the following steps:
   // 1- downgrade the mongoose version for example to 5 => npm i mongoose@5 or
   // using the .clone() before .findOne()
   // NOTE: to pass the variable r from pre middleware to post middleware, we need to wrap r in a "this" => in this case we can access to that varibale with "this" again in a post middleware!
   //  const r = await this.clone().findOne(); r is here a simple variable
   this.r = await this.clone().findOne(); // we created a property on r variable
   //  console.log(this.r);
   next();
});

reviewSchema.post(/^findOneAnd/, async function () {
   // NOTE: to call the calcAverageRatings function, we have to use this.r.constructor
   // this.r = await this.clone().findOne(); doesn't NOT work here, query has already executed!

   if (!this.r) {
      return;
   }
   await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
