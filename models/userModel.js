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
      validate: {
         // NOTE: This works only on SAVE()!!! and CREATE()!!! => save() function, when we
         // want to update the user we have to use save() and not findOneAndUpdate().
         // like this:  const newUser = await User.create(req.body);
         // and like this:  const updateUser = await User.save();
         validator: function (el) {
            return el === this.password; // abc === abc => return true! otherwise, it would be false!
         },
         message: 'Passwords are not the same!',
      },
   },
});

// NOTE: Creating the model:
const User = mongoose.model('User', userSchema);
module.exports = User;
