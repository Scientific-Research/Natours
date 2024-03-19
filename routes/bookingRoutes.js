const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

const { protect, restrictTo } = authController;
router.use(protect); // all the following routes use the protect middleware, therefore, we don't need to apply protect middleware one by one, rather only in one place and for all routes!

const {
   getCheckoutSession,
   getAllBooking,
   getBooking,
   createBooking,
   updateBooking,
   deleteBooking,
} = bookingController;

router.get('/checkout-session/:tourId', getCheckoutSession);

// CRUD operations for booking section:

router.use(restrictTo('admin', 'lead-guide')); // all following routes are allowed to be executed only by admin or lead-guide and nobody else!

router.get('/', getAllBooking);
router.post('/', createBooking);

router.get('/:id', getBooking);
router.patch('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
