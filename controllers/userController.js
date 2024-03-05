const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // res.status(500).json({
  //    data: {
  //       status: 'error',
  //       message: 'This route is not yet defined! - getAllUsers',
  //    },
  // });

  // NOTE: because of select:false for password in userModel.js, we don't see the password in
  // Postman, when we get all users with this command: 127.0.0.1:3000/api/v1/users
  const users = await User.find();
  const Result = users.length;
  res.status(200).json({ status: 'success', Results: Result, AllUsers: users });
});

// NOTE: we want to update the currently logged in User: => updating name and email address:
exports.updateMe = (req, res, next) => {
  // 1) Create error if user POSTs password data
  // 400 is for bad request!
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  // 2) Update user document
};

exports.getUser = (req, res) => {
  res.status(500).json({
    data: {
      status: 'error',
      message: 'This route is not yet defined! - getUser',
    },
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    data: {
      status: 'error',
      message: 'This route is not yet defined! - createUser',
    },
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    data: {
      status: 'error',
      message: 'This route is not yet defined! - updateUser',
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    data: {
      status: 'error',
      message: 'This route is not yet defined! - deleteUser',
    },
  });
};
