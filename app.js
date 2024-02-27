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

// NOTE: all means all the http Methods like get, post, ...
// we write here a middleware for all invalid URL(Routes) which are not listed as our valid Routes
// Compiler checks our all above Routes and when it doesn't find a matched one, comes here finally
// to this middleware and send the Error Message: `Can't find ${req.originalUrl} on this Server!`,
// * means every URL => all of them
// another important NOTE is that, this middleware must stay at the end and not before other
// middleware or Routes! when i put it at the top, we will never reach other Routes and we
// will receive always an Error Message!
// req.originalUrl: means the requested URL
app.all('*', (req, res, next) => {
   // res.status(404).json({
   //    status: 'fail',
   //    message: `Can't find ${req.originalUrl} on this Server!`,
   // });

   // we produce an error:
   const err = new Error(`Can't find ${req.originalUrl} on this Server!`); // we use built-in error constructor
   err.sttaus = 'fail';
   err.statusCode = 404;
   // when next() recieve a parameter, express understood that, an error happened!
   // it doesn't matter which parameter, express consider it as an Error!
   // and then express will skip all other middlewares in between and go straight to our
   // global Error Handler for entire project which is located below!
   // At the moment, there is no other middleware in between, but if would be somes,
   // it will does the same! or even in other files in our project!
   next(err);
});

// NOTE: defining a global Error Handler for entire project
// this middleware function is a first Error function => it means err comes as first Parameter
// and then comes req, res and at the end comes next
// when we have four parameters and err comes at the beginning, Express understand automatically
// that this is an error handling middleware!
app.use((err, req, res, next) => {
   // we have different error status Codes like 400,404,500,..., that's why we have to get the
   // error from every occurred erorr and when there is no error code for the occurred error,
   // we consider it as Error with Code 500!
   err.statusCode = err.statusCode || 500; // if it is defined, StatusCoe is what error itself has
   // when it is not defined, we consider it as 500 which means Internal Server Error!
   err.status = err.status || 'error'; // it status is defined, status takes what the error has,
   // it status is not defined, it would be 'error' which is for 500 statusCode!
   // and when it is 400 or 404 status Code, it would be 'fail' as we write it as status in our json!

   // NOTE: first of all, we see what is statusCode and after that, it gives us the related
   // status and message for that error!
   res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
   });
});

// Export the app from here to the Server.js
module.exports = app;
