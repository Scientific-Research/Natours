const express = require('express');

const router = express.Router();
// const userRouter = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// using deconstructuring:
const { getAllUsers, getUser, createUser, updateUser, deleteUser, updateMe } =
  userController;

const {
  protect,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = authController;

// Route for auths:
// NOTE: for signup only 'post' (send the user data) make sense and 'get' or 'patch'
// doesn't make sense!
// 127.0.0.1:3000/api/v1/users/signup
router.post('/signup', signup);
router.post('/login', login);

// NOTE: these two routes for forgotPassword and resetPassword functions!
// first of all, we will start to implement forgotPassword:
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// updateMyPassword works only for logged in users, that's why we have to put protect in the route which puts the user object on our request object!
router.patch('/updateMyPassword', protect, updatePassword);

// Route for users:
// NOTE: protect: it means only logged in users can update the user information!
// NOTE: this route muss stay at the top of other routes which are only intended for users! otherwise, it will not work!
router.patch('/updateMe', protect, updateMe);

router.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/').get(getAllUsers).post(createUser);
// app.route('/api/v1/users').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
