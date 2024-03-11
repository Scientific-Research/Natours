const express = require('express');

const router = express.Router();

// NOTE: This route is for pug engine template:
// 1)
router.get('/', (req, res) => {
   // we don't use .json({}) anymore, rather, we use .render() tosend the data to browser!
   res.status(200).render('base', {
      tour: 'The Forest Hiker',
      user: 'Jonas',
   }); // we don't need to specify .pug extension. Express will detect it automatically!
});

// 2)
router.get('/overview', (req, res) => {
   res.status(200).render('overview', {
      title: 'All Tours',
   });
});

// 3)
router.get('/tour', (req, res) => {
   res.status(200).render('tour', {
      title: 'The Forest Hiker Tour',
   });
});

module.exports = router;
