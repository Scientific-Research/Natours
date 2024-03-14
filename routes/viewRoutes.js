const express = require('express');
const viewsController = require('../controllers/viewsController');
const authConteroller = require('../controllers/authController');

const router = express.Router();

const { getOverview, getTour, getLoginForm } = viewsController;
const { isLoggedIn } = authConteroller;

// NOTE: we want that isLoggedIn middleware to be applied to all the following routes that we have here! => that's why we put this middleware on top of all other routes!
router.use(isLoggedIn);

// NOTE: This route is for pug engine template:
router.get('/', getOverview);

// NOTE: protect our Tour in a way that, when i click the details, it doesn't go in, unless i am already einlogged! => that was only for test, it doesn't make sense anymore!
// router.get('/tour/:slug', protect, getTour);

router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

//   /login
module.exports = router;
