const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel'); // we need this only for embedding and not for Referencing
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'A tour must have a name'],
         unique: true,
         trim: true,
         // Adding two validators which are available on Strings!
         maxLength: [40, 'A tour name must have less or equal than 40 Characters'],
         minLength: [10, 'A tour name must have more or equal than 10 Characters'],
         // NOTE: we don't call the isAlpha, rather we use it here!
         // validate: [validator.isAlpha, 'Tour name must only contains Characters!'],
         // NOTE: this is not a good validator, because it doesn't accept space between characters!
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
         // enum validator is only available for strings
         enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult',
         },
      },
      ratingsAverage: {
         type: Number,
         default: 4.5,
         // Adding two validators which are available on Numbers and Dates!
         min: [1, 'Rating must be above 1.0'],
         max: [5, 'Rating must be below 5.0'],
      },
      ratingsQuantity: {
         type: Number,
         default: 0,
      },
      price: {
         type: Number,
         required: [true, 'A tour must have a price'],
      },
      priceDiscount: {
         type: Number,
         // NOTE: we use validate word to create our own validator:
         // val is here the priceDiscount
         validate: {
            validator: function (val) {
               // NOTE: "this" only points to current doc on NEW document creation!
               return val < this.price; // 100 < 200 => true, otherwise: false trigger a validation
               // error
            },
            message: 'Discount price ({VALUE}) should be below the regular price!',
            // NOTE: this VALUE here in a form of Object has the same value as val above!
         },
      },
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
      startLocation: {
         // NOTE: In order to specify Geospecial data, we need to use GeoJSON.
         type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
         },
         coordinates: [Number], // this number is coordinates of the point: Langitude and Latitude.
         address: String,
         description: String,
      },
      locations: [
         // we created here embedded documents:
         {
            type: {
               type: String,
               default: 'Point',
               enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number,
         },
      ],
      // NOTE: this is for CONNECT TOUR AND USER BY EMBEDDING: WE NEED PRE SAVE MIDDLEWARE wHICH IS BELOW AND COMMENTED OUT ALREADY DUE TO TEST THE REFERENCING METHOD!
      //  guides: Array,
      // NOTE: this is for CONNECT TOUR AND USER BY REFERENCING: NO NEED TO PRE SAVE MIDDLEWARE
      // By referencing, we don't need the pre save middleware anymore and we need only the following guides array.
      // NOTE: unlike the embedding method, we don't get all the infor about the users, rather, we get only the IDs for the users that we send as an array in Postman!
      guides: [
         {
            type: mongoose.Schema.ObjectId, // type is actually mongoDB ID
            ref: 'User', // and thid is the magic behind the scence => ref for Referencing the Tour and User by Id.
            // here we create a reference to another Model => User!
            // In this way, i create effectively a relationship between these two datasets!
         },
      ],
      // NOTE: this is the child referencing => Tour referencing reviews! but we don't use it, instead, we use a new feature in mongoose, it called: virtual populate.
      // I will comment it out to implement the virtual populate!
      // review: [
      //   {
      //     type: mongoose.Schema.ObjectId,
      //     ref: 'Review',
      //   },
      // ],
   },
   {
      // NOTE: we have to say that we will need the Virtuals, when the data goes to be published at
      // output!
      toJSON: { virtuals: true }, // when the data outputted as JSON
      toObject: { virtuals: true }, // when the data outputted as Object
   }
);

// NOTE: specifying an index for price:
// tourSchema.index({ price: 1 }); // -1 for descending Order!
// NOTE: or using Compound indexing:
tourSchema.index({ price: 1, ratingsAverage: -1 }); // -1 for descending Order!

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

// NOTE: implementing the review for tours using virtual populate:
// VIRTUAL POPULATE: I USED THE CHILD RFERENCING ABOVE, BUT I COMMENTED THAT OUT AND I USE NOW HERE VIRTUAL POPULATE!
// NOTE: I will test the virtual populate in Postman, when we get only one tour => it means, we get reviews only for one tour. Reviews for all tours are too much information to send to the client => because we have all tours and the reviews comes in too! => too juch info! In Postman: {{URL}}api/v1/tours/5c88fa8cf4afda39709c2951
tourSchema.virtual('reviews', {
   ref: 'Review', // here we need the name of the model to that we reference!
   foreignField: 'tour', // tour is located in reviewModel.js
   localField: '_id', // these two fields, Review and tour are connected together via _id.
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

/////////////////////////////////CONNECT TOUR AND USER BY EMBEDDING///////////////
// // NOTE: again a pre save middleware, each time that a new tour saves, the user documents corresponding the IDs will retrieve behind the scene automatically!
// tourSchema.pre('save', async function (next) {
//   // as we defined it above, the guides is an array of all the user IDs=> therefore, we can map between its items
//   // NOTE: guides receives user corresponding to evvery ID but with many resolved Promises and we have to await this array to get the correct results at the end! => therefore, we need Promise.all()
//   //   const guides = this.guides.map(
//   //     async (id) => await User.find((user) => user.id === id)
//   //   );
//   // OR THIS ONE:
//   // NOTE: using map => from guides array, we get the id and from User, we get the user corresponding to this Id.
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   // we have to use await Promise.all() because the guidesPromises is full of resolved Promises and to get the correct results in guides as an array.
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
/////////////////////////////////CONNECT TOUR AND USER BY EMBEDDING///////////////

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

// NOTE: we can also use query middleware and don't repeat again the populate code:
// this query will run when we a find query => find all Tours, find a tour with Id,....
tourSchema.pre(/^find/, function (next) {
   // NOTE: In query middleware, this always point to the current query, therefore, all the queries will then automatically populate the guides field with the reference users!
   this.populate({
      path: 'guides', // we populate guides field that we just specified before!
      select: '-__v -passwordChangedAt', // - means deselect, but of course, only in guides array!
   });
   next();
});

// NOTE: A post middleware for find() => this middleware will run after Query was executed!
// that's why it has access to the documents which returned!
tourSchema.post(/^find/, function (docs, next) {
   // console.log(`Query took ${Date.now() - this.start} milliseconds!`);
   // Query took 41 milliseconds!
   // console.log(docs); // it shows us the matched data to the console!
   // I comment docs out due to not polluting my VSCode Terminal!
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

// NOTE: AGGREGATION MIDDLEWARE: we want that this happens before Aggregation runs, that's why
// we use pre() here! The problem is that, in Get Tour Stats in Postman, we get aggregation for
// 10 tours, but one of them is secret and hast not to be included in this tour aggregation.
// In Get ALL Tours, we have only 9 tours which is correct and one is hidden.
// That's why we have to do this aggregation middleware before aggregation happens to exclude
// the sectret tour and then aggregation can executes on the tour!

tourSchema.pre('aggregate', function (next) {
   // NOTE: this is an array and we can put an element in the beginning of an array using
   // unshift() - shift() put an elemnt at the end of the array.
   // we put { secretTour: { $ne: true } } at the beginning of the array before it enters the
   // pipeline => removing all the documents that have secretTour: true
   // and now, when i run 127.0.0.1:3000/api/v1/tours/tour-stats in postman, i will get 9 tours
   // which is correct and one is secret that it doesn't come in!
   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
   console.log(this.pipeline()); // "this" point to the current aggregation Object!
   // this.pipeline() gives us the three stages that we had before: match, group and sort
   // it shows us here this as pipeline!
   next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; // we will use this Tour in tourController.js to do the CRUD operations
// there! that's why i will import it in tourController.js
