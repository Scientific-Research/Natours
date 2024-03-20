const express = require('express');
const viewsController = require('../controllers/viewsController');
const authConteroller = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

const {
   getOverview,
   getTour,
   getLoginForm,
   getAccount,
   updateUserData,
   getMyTours,
} = viewsController;

const { isLoggedIn, protect } = authConteroller;

const { createBookingCheckout } = bookingController;

// NOTE: we want that isLoggedIn middleware to be applied to all the following routes that we have here! => that's why we put this middleware on top of all other routes!
// router.use(isLoggedIn); we added this middleware separately in requested routes but remove from here, because we don't want to apply it twice to /me route! both isLoggedIn and protect have the same concept to get the current user, exactly that we want here, that's why we don't need to repeat it twice here!

// NOTE: This route is for pug engine template:
router.get('/', createBookingCheckout, isLoggedIn, getOverview);

// NOTE: protect our Tour in a way that, when i click the details, it doesn't go in, unless i am already einlogged! => that was only for test, it doesn't make sense anymore!
// router.get('/tour/:slug', protect, getTour);

router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', createBookingCheckout, protect, getMyTours);
router.post('/submit-user-data', protect, updateUserData);

//   /login
module.exports = router;
