const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');

const { getOverview, getTour, getLoginForm } = viewsController;

// NOTE: This route is for pug engine template:
router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

//   /login
module.exports = router;
