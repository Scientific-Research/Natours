const express = require('express');

const router = express.Router();

const reviewController = require('../controllers/reviewController');

const { getAllReviews, createReview } = reviewController;

router.route('/').get(getAllReviews);
router.route('/').post(createReview);

module.exports = router;
