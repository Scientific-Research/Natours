const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
   // NOTE: when we use catchAsync(), we don't need to use try() catch() anymore! that's why
   // i comment them out there!
   //    try {
   // const newUser = await User.create(req.body);
   // NOTE: using deconstructuring:
   const { name, email, password, passwordConfirm } = req.body;
   const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      /*
      name: req.body.name,
      email: req.body.name,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      */
   });

   res.status(201).json({
      // 201 is used for creating the user!
      status: 'success',
      User: newUser,
   });
   //    } catch (err) {
   //       status: 'fail';
   //       message: 'Error creating a new User' + err.message;
   //    }
});

// NOTE: the next step to create the signup route in which this signup function can be called!

// NOTE: this module.exports = signup doesn't work here, we have use exports.signup = ...
// module.exports = signup;
