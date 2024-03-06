const express = require('express');

const router = express.Router();

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const { getAllReviews, createReview } = reviewController;
const { protect, restrictTo } = authController;

router.route('/').get(getAllReviews);
// NOTE: we want that only logged in users and also regular users(not admin or guide users) post a review!
router.route('/').post(protect, restrictTo('user'), createReview);

module.exports = router;
