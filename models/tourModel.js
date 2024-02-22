const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
   },
   rating: {
      type: Number,
      default: 4.5,
   },
   price: {
      type: Number,
      required: [true, 'A tour must have a price'],
   },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; // we will use this Tour in tourController.js to do the CRUD operations
// there! that's why i will import it in tourController.js
