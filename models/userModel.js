const mongoose = require('mongoose');
const validator = require('validator');
// name, email, photo, password, passwordConfirm

// NOTE: Creating the Schema:
const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please tell us your name!'],
   },
   email: {
      type: String,
      required: [true, 'Please provide your email!'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email!'],
   },
   photo: {
      type: String,
   },
   password: {
      type: String,
      reqired: [true, 'Please provide a password!'],
      minLength: 8,
   },
   passwordConfirm: {
      type: String,
      required: [true, ' Please confirm your password!'],
   },
});

// NOTE: Creating the model:
const User = mongoose.model('User', userSchema);
module.exports = User;
