const fs = require('fs');
const express = require('express');

const app = express();
// our first built-in middleware function
app.use(express.json());

// create our own middleware function:
app.use((req, res, next) => {
   console.log('Hello from our own middleware!');
   next(); // calling the next() here!
});

let tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Refactoring
const getAllTours = (req, res) => {
   res.status(200).json({
      status: 'success',
      results: tours.length,
      tours,
   });
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

// this only for get() and post()
app.route('/api/v1/tours').get(getAllTours).post(createTour);
// this only for get() => one item, patch() and delete()
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
   console.log(`Server is listening on PORT ${PORT}`);
});
