const fs = require('fs');

// let tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
let tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// const tourRouter = express.Router();
// app.use('/api/v1/tours', router);
// app.use('/api/v1/tours', tourRouter);
// this middleware is placed before all the other middlewares to check if the id is valid
// then goes to the next middleware, otherwise, it will return and will not go to other middlewares.
exports.checkID = (req, res, next, val) => {
   console.log(`Tour id is: ${val}`); // val has the value of id
   if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID -- Checked by checkID middleware in tourController.js',
      });
   }
   next();
};

// Check Body
exports.checkBody = (req, res, next) => {
   if (!req.body.name || !req.body.price) {
      return res.status(400).json({
         status: 'fail',
         message: 'Missing name or price properties!',
      });
   }
   next();
};

// 2) ROUTE HANDLERS
// const getAllTours = (req, res,next) => {
exports.getAllTours = (req, res) => {
   console.log(req.requestTime);
   res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      tours,
   });
   // next();
};

exports.getTour = (req, res) => {
   const id = req.params.id;
   console.log('id: ' + id);

   try {
      console.log('Tours length: ' + tours.length);

      const tour = tours.find((item) => item.id === parseInt(id));
      if (!tour) throw new Error('Invalid ID! Please try again later!');
      console.log(tour);
      res.status(200).json({
         status: 'success',
         tour,
      });
   } catch (err) {
      res.status(404).json({
         status: 'fail',
         message: err.message,
      });
   }
};

exports.createTour = (req, res) => {
   const id_1 = tours.length - 1;
   const newId = id_1 + 1;
   const newTour = req.body;
   newTour.id = newId;
   console.log(newTour);

   tours.push(newTour);
   fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
      res.status(201).json({
         status: 'success',
         tours: newTour,
      })
   );
};

exports.updateTour = (req, res) => {
   const id = req.params.id;

   try {
      const tour = tours.find((item) => item.id === parseInt(id));
      if (!tour) throw new Error('Invalid ID! Please try again later!');
      console.log('Before Patch => Updating');
      console.log(tour);

      const newTour = req.body;

      newTour.id = parseInt(id);
      let toursId = tours.indexOf(tours[id]);
      tours[toursId] = newTour;

      console.log('After Patch => Updating');
      console.log(newTour);

      fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
         res.status(201).json({
            status: 'success',
            tours: newTour,
         })
      );
   } catch (err) {
      res.status(404).json({
         status: 'fail',
         message: err.message,
      });
   }
};

exports.deleteTour = (req, res) => {
   const id = req.params.id;

   try {
      const tour = tours.find((item) => item.id === parseInt(id));
      if (!tour) throw new Error('No tour with this ID anymore! pick a different one.');

      let deletedTour = tours.filter((el) => el.id === parseInt(id));
      let notDeletedTours = tours.filter((el) => el.id !== parseInt(id));
      console.log(deletedTour);
      tours = notDeletedTours;
      fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
         res.status(200).json({
            status: 'success',
            deletedTour: deletedTour,
         })
      );
   } catch (err) {
      res.status(404).json({
         status: 'fail',
         message: err.message,
      });
   }
};
