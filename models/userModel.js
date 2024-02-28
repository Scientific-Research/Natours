const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
   photo: {
      type: String,
   },
   password: {
      type: String,
      reqired: true,
   },
   passwordConfirm: {
      type: String,
      required: true,
   },
});

const userModel = userSchema.Model('User');
module.exports = userModel;
