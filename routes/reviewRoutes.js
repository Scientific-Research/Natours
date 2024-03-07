const express = require('express');

// const router = express.Router();
// NOTE: we can here add some options for merge params
const router = express.Router({ mergeParams: true });
// NOTE: when we want to have access to the parameters of other routes, it means we are now in reviewRoutes.js and we want to access the tourId but it is not here, rather, it is in tourRouter.js => that's why we use mergeParams: true to give us this possibility to have access to this parameter but in another Route!
// It means no matter if we get now this route or another route, at the end, it will end in the following route:
// This route:
// POST /tour/65342wer/reviews
// OR this route:
// POST /reviews
// at the end it comes with the following route: which is also at the end of this page:
// router.route('/').post(protect, restrictTo('user'), createReview);

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const { getAllReviews, createReview, deleteReview, updateReview } =
  reviewController;
const { protect, restrictTo } = authController;

// POST /tour/65342wer/reviews
// GET /tour/65342wer/reviews
router.route('/').get(getAllReviews);
// NOTE: we want that only logged in users and also regular users(not admin or guide users) post a review!
router.route('/').post(protect, restrictTo('user'), createReview);

router.route('/:id').patch(protect, updateReview);

router.route('/:id').delete(protect, restrictTo('admin'), deleteReview);

module.exports = router;
