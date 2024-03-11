const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');

const { getOverview, getTour } = viewsController;

// NOTE: This route is for pug engine template:
router.get('/', getOverview);
router.get('/tour', getTour);

module.exports = router;
