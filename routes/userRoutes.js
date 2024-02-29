const express = require('express');

const router = express.Router();
// const userRouter = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// using deconstructuring:
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = userController;
const { signup, login } = authController;

// Route for auths:
// NOTE: for signup only 'post' (send the user data) make sense and 'get' or 'patch'
// doesn't make sense!
// 127.0.0.1:3000/api/v1/users/signup
router.post('/signup', signup);
router.post('/login', login);

// Route for users:
router.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/').get(getAllUsers).post(createUser);
// app.route('/api/v1/users').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
