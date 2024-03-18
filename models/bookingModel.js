const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schama({
   tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a Tour!'],
   },
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User!'],
   },
   price: {
      type: Number,
      require: [true, 'Booking must have a price.'],
   },
   createdAt: {
      type: Date,
      default: Date.now(),
   },
   paid: {
      type: Boolean,
      default: true,
   },
});

// NOTE: to populate user and tour automatically, whenever there is a query => using query middleware => pre + regular expressions
bookingSchema.pre(/^find/, function (next) {
   this.populate('user').populate({
      path: 'tour',
      select: 'name',
   });
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
