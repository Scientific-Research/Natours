const express = require('express');

const router = express.Router();
// const userRouter = express.Router();
const userController = require('../controllers/userController');

// using deconstructuring:
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = userController;

// Route for users:
router.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/').get(getAllUsers).post(createUser);
// app.route('/api/v1/users').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
