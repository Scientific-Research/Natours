const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
console.log(process.env.NODE_ENV);

// WHEN WE ARE ONLY AND ONLY IN DEVELOPMENT MODE; MORGAN WILL SHOW US THIS INFO: GET /api/v1/tours/9 200 5.404 ms - 142
// IN VSCODE TERMINAL. WHEN I CHANGE IT TO PRODUCTION; IT WILL NOT SHOW US SUCH INFO.
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev')); // one output as an example: GET /api/v1/tours/9 200 5.404 ms - 142
}
// our first built-in middleware function
app.use(express.json());
// how to show the static files using middleware in express:
app.use(express.static(`${__dirname}/public`)); //=> http://127.0.0.1:3000/overview.html
// OR: http://127.0.0.1:3000/img/pin.png

// 1- create our own middleware function: => our global route handler before other ones:
// app.use((req, res, next) => {
//    console.log('Hello from our own middleware!');
//    next(); // calling the next() here!
// });

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

// Export the app from here to the Server.js
module.exports = app;
