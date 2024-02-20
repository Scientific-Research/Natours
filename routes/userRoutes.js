const express = require('express');

const router = express.Router();
// const userRouter = express.Router();

const getAllUsers = (req, res) => {
   res.status(500).json({
      data: {
         status: 'error',
         message: 'This route is not yet defined! - getAllUsers',
      },
   });
};

const getUser = (req, res) => {
   res.status(500).json({
      data: {
         status: 'error',
         message: 'This route is not yet defined! - getUser',
      },
   });
};

const createUser = (req, res) => {
   res.status(500).json({
      data: {
         status: 'error',
         message: 'This route is not yet defined! - createUser',
      },
   });
};

const updateUser = (req, res) => {
   res.status(500).json({
      data: {
         status: 'error',
         message: 'This route is not yet defined! - updateUser',
      },
   });
};

const deleteUser = (req, res) => {
   res.status(500).json({
      data: {
         status: 'error',
         message: 'This route is not yet defined! - deleteUser',
      },
   });
};

// Route for users:
router.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/').get(getAllUsers).post(createUser);
// app.route('/api/v1/users').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
