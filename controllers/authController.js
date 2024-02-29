const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
   // NOTE: when we use catchAsync(), we don't need to use try() catch() anymore! that's why
   // i comment them out there!
   //    try {
   const newUser = await User.create(req.body);

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
