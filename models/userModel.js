const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
      // to hide it from client:
      select: false,
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

// NOTE: keep always fat Model and thin Controller philosophy in mind, that's why I write the
// password encryption here! we use here mongoose document middleware => pre middleware on save:
// we had it already and we defined it already on the Schema:
// the the middleware function => Encryption will happen between the moment that we receive
// the data and the moment which is persisted to the database! this is the moment which pre save()
// middleware runs! => between getting the data and save it to the database!
// this is the perfect time to manipulate the data!
userSchema.pre('save', async function (next) {
   // we want to encrypt the password when it is newly created or updated(changed)!
   // this refers here to current user.
   // Only run this function if password was actually modified!
   if (!this.isModified('password')) return next(); // when password is not modified, return and does
   // nothing!
   // Otherwise: encrypt or hash the password: bcrypt add random string to the passwords, in such
   // a way that two equal passwords don't generate the same hash! => bcrypt salt our passwords!
   // Hash the password with const of 12
   this.password = await bcrypt.hash(this.password, 12); // 12 means how CPU can intensively encrypt our password!
   // 12 is now max and being higher of this value, more instensiver would be the encrypted password!
   // more than 12 is also possible but it would takes much more time!
   // not to making it too easy to break the password and not getting a high number to make it
   // too long for encrypting the password!

   // NOTE: even we have two different emails with the same password, we will have two completely
   // different encrypted password and that is because of salting the passwords with random strings
   // before hashing them and this is the real power of Encryption!

   // NOTE: to delete the passwordConfirm before persisting in Database => define it as undefined!
   // we need passwordConfirm only when the user enters the password to repeat it again and not
   // make a mistake in entering the password, otherwise we don't need that here anymore!
   // Delete passwordConfirm field
   this.passwordConfirm = undefined;
   // passwordConfirm is required only as input field but not required as persisting in database!
   // after running Postman: 127.0.0.1:3000/api/v1/users/signup, we see the encrypted password
   // there and we don't see the passowrdConfirm anymore because of this.passwordConfirm = undefined;
   next();
});

// NOTE: check if the entered password is the same with the stored one in database:
// we use instance method:
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
   return await bcrypt.compare(candidatePassword, userPassword);
   // if these two passwords are the same, return true, otherwise, return false!
};

// NOTE: Creating the model:
const User = mongoose.model('User', userSchema);
module.exports = User;
