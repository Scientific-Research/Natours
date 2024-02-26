const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'A tour must have a name'],
         unique: true,
         trim: true,
      },
      slug: String,
      duration: {
         type: Number,
         required: [true, 'A tour must have a duration'],
      },
      maxGroupSize: {
         type: Number,
         required: [true, 'A tour must have a group size'],
      },
      difficulty: {
         type: String,
         required: [true, 'A tour must have a difficulty'],
      },
      ratingsAverage: {
         type: Number,
         default: 4.5,
      },
      ratingsQuantity: {
         type: Number,
         default: 0,
      },
      price: {
         type: Number,
         required: [true, 'A tour must have a price'],
      },
      priceDiscount: Number,
      summary: {
         type: String,
         trim: true,
         required: [true, 'A tour must have a description'],
      },
      description: {
         type: String,
         trim: true,
      },
      imageCover: {
         type: String,
         required: [true, 'A tour must have a cover image'],
      },
      images: [String],
      createdAt: {
         type: Date,
         default: Date.now(),
         select: false, // it will not display this item in a tour in Postman, when we get the list
         // of the tours!
      },
      startDates: [Date],
      // This field is for Query Middleware => find, when tour is public, it would be open,
      // otherwise: secret
      secretTour: {
         type: Boolean,
         default: false,
      },
   },
   {
      // NOTE: we have to say that we will need the Virtuals, when the data goes to be published at
      // output!
      toJSON: { virtuals: true }, // when the data outputted as JSON
      toObject: { virtuals: true }, // when the data outputted as Object
   }
);

// NOTE: durationWeeks will not persist in DB, it will be there only when get the data and then
// will be gone!
// defining virtual properties: we have to write regular function instead of arrow function here
// because arrow function, doesn't take his own "this" key word!
tourSchema.virtual('durationWeeks').get(function () {
   return this.duration / 7; // for example, if a tour has 7 days => 7 / 7 => it would be 1 week!
   // NOTE: "this" points to current document!
   // NOTE: we can not use the durationWeek as part of a query for example: Tour.find(durationWeek===1)
   // it will not work because durationWeek is not persistant( doesn't stay) in DB!
});

// NOTE: We define a Document middleware from Mongoose and not from Express and it must be
// define here in Schema like Virtuals and not anywhere else:
// pre() middleware which will gonna run before an event take places! and our event here is
// 'save':
// DOCUMENT MIDDLEWARE: runs before .save() and .create() but not before .insertMany()
tourSchema.pre('save', function (next) {
   // NOTE: this function will be called before an actual document is saved to the DB:
   // console.log(this); // "this" points to the currently proccessed document.
   // NOTE: to run this middleware, we have to create or save a document in Postman.
   this.slug = slugify(this.name, { lower: true });
   next(); // but actually, we don't have the next middleware to call it, anyway, it's good practice
   // to put it there!
});

// tourSchema.pre('save', function (next) {
//    console.log('Will save document...');
//    next();
// });

// another Document middleware with post(), post has doc and next
// tourSchema.post('save', function (doc, next) {
//    console.log(doc); // doc has the same info like tour and is post here, that's why comes after
//    // pre middleware!
//    next();
// });

// NOTE: Query Middleware - second category of Mongoose middleware after Document Middleware!
// find point out to the current Query Middleware and not current document middleware anymore!
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
   this.find({
      // NOTE: this doesn't work: secretTour: false, // find the tours in which
      // secretTour is not equal true.
      secretTour: { $ne: true }, // find the tours in which secretTour is not equal true.
      // or it is false, or other tours don't have such field!
   });

   // NOTE: How we can measure the execution time of a query: post() time - pre() time
   this.start = Date.now(); // Time in milliseconds!
   next();
});

// NOTE: A post middleware for find() => this middleware will run after Query was executed!
// that's why it has access to the documents which returned!
tourSchema.post(/^find/, function (docs, next) {
   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
   // Query took 41 milliseconds!
   console.log(docs); // it shows us the matched data to the console!
   next();
});

// NOTE: to get only one tour, we use findById(id) and this is synonyme of findOne when we
// want to use it as Query Middleware and it works fine in Postman -
// but there is another way => using Regular Expressions => /^find/ => ^ means all find =>
// findOne, findById, ... => all of these find will trigger our function as call back here!
// that's why i comment the below function and put the RE in above function.

// tourSchema.pre('findOne', function (next) {
//    this.find({
//       // NOTE: this doesn't work: secretTour: false, // find the tours in which
//       // secretTour is not equal true.
//       secretTour: { $ne: true }, // find the tours in which secretTour is not equal true.
//       // or it is false, or other tours don't have such field!
//    });
//    next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; // we will use this Tour in tourController.js to do the CRUD operations
// there! that's why i will import it in tourController.js
