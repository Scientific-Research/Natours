const express = require('express');
const router = express.Router();
// const userRouter = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// using deconstructuring:
const {
  getAllUsers,
  getUser,
  getMe,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  uploadUserPhoto,
  resizeUserPhoto
} = userController;
const {
  protect,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  logout
} = authController;

// Route for auths:
// NOTE: for signup only 'post' (send the user data) make sense and 'get' or 'patch'
// doesn't make sense!
// 127.0.0.1:3000/api/v1/users/signup
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout); // we don't send any data with the request and we don't change any data too! we just get the data!

// NOTE: these two routes for forgotPassword and resetPassword functions!
// first of all, we will start to implement forgotPassword:
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// updateMyPassword works only for logged in users, that's why we have to put protect in the route which puts the user object on our request object!

// NOTE: router.use(protect); means that all the routes after this point will be protected! because middleware runs in sequence! and we don't need to mention the protect word one by one for every route and the routes that had already protect middleware, we can just remove them! we use this middleware that comes before all other routes!

// Protect all routes after this middleware!
router.use(protect);
// NOTE: from this point to the end, for every operation the user must be logged in!

// router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMyPassword', updatePassword);

// NOTE: // The getMe comes before getOne in userRoutes.js because it is very similar to the getOne but only the difference is get One takes the req.params.id and get Me takes req.user.id, that's why with this statement: req.params.id = req.user.id; we assign the user.id to params.id and other things are exactly the same and we don't need to chnage them!
// router.get('/me', protect, getMe, getUser);
// when the getMe is before getUser, it means to execute getUser as getMe, after coming from protect(the user is logged already), we come to the getMe => params.id would be user.id, and this is what we need in getMe and at the end, getUser will be executed and because of we assigned the user.id to the params.id => the getUser would be actually getMe, because in getUser, we just need the params.id and not the user.id!

// router.get('/me', protect, getMe, getUser);
router.get('/me', getMe, getUser);

// Route for users:
// NOTE: protect: it means only logged in users can update or delete the user information!
// NOTE: this route muss stay at the top of other routes which are only intended for users! otherwise, it will not work!

// router.patch('/updateMe', protect, updateMe);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);

// NOTE: This will not delete the user from database, it will make it unaccessable only!

// router.delete('/deleteMe', protect, deleteMe);
router.delete('/deleteMe', deleteMe);

////////////////////////////////////ONLY ADMIN PEOPLE CAN ACCESS THESE BELOW ROUTES/////////

router.use(restrictTo('admin')); // ONLY ADMIN CAN DO THE FOLLOWING OPERATIONS IN THESE BELOW ROUTES! THEY ARE NOT ONLY PROTECTED, BUT ALSO RESTRICTED TO THE ADMIN! BUT FOR THE ROUTES BEFORE THAT, ALL LOGGED IN PEOPLE CAN ACCESS THEM AND NOT ONLY ADMIN!

router.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/').get(getAllUsers).post(createUser);
// app.route('/api/v1/users').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;