const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev')); // one output as an example: GET /api/v1/tours/9 200 5.404 ms - 142
// our first built-in middleware function
app.use(express.json());

// 1- create our own middleware function: => our global route handler before other ones:
app.use((req, res, next) => {
   console.log('Hello from our own middleware!');
   next(); // calling the next() here!
});
// 2- create our own middleware function: => our global route handler before other ones:
app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
});
let tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Refactoring
// 2) ROUTE HANDLERS
// const getAllTours = (req, res,next) => {
const getAllTours = (req, res) => {
   console.log(req.requestTime);
   res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      tours,
   });
   // next();
};

const getTour = (req, res) => {
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

const createTour = (req, res) => {
   const id_1 = tours.length - 1;
   const newId = id_1 + 1;
   const newTour = req.body;
   newTour.id = newId;
   console.log(newTour);

   tours.push(newTour);
   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
      res.status(201).json({
         status: 'success',
         tours: newTour,
      })
   );
};

const updateTour = (req, res) => {
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

      fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
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

const deleteTour = (req, res) => {
   const id = req.params.id;

   try {
      const tour = tours.find((item) => item.id === parseInt(id));
      if (!tour) throw new Error('Invalid ID! Please try again later!');

      let deletedTour = tours.filter((el) => el.id === parseInt(id));
      let notDeletedTours = tours.filter((el) => el.id !== parseInt(id));
      console.log(deletedTour);
      tours = notDeletedTours;
      fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours, null, 2), () =>
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

// All the routes
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES
// this only for get() and post()
app.route('/api/v1/tours').get(getAllTours).post(createTour);

// this only for get() => one item, patch() and delete()
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

// Route for users:
app.route('/api/v1/users').get(getAllUsers).post(createUser);

app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

// 4) START SERVER
PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
   console.log(`Server is listening on PORT ${PORT}`);
});
