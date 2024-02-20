const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

// Refactoring

// All the routes
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

// 4) START SERVER
PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
   console.log(`Server is listening on PORT ${PORT}`);
});
