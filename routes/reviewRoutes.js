const express = require('express');

const router = express.Router();

const reviewController = require('../controllers/reviewController');

const { getAllReviews } = reviewController;

router.route('/').get(getAllReviews);

module.exports = router;
