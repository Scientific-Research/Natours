const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');
const authConteroller = require('../controllers/authController');

const { getOverview, getTour, getLoginForm } = viewsController;
const { protect } = authConteroller;

// NOTE: This route is for pug engine template:
router.get('/', getOverview);
// NOTE: protect our Tour in a way that, when i click the details, it doesn't go in, unless i am already einlogged!
router.get('/tour/:slug', protect, getTour);
router.get('/login', getLoginForm);

//   /login
module.exports = router;
