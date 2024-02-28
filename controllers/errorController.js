const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
   // path is _id and value is what we entered in URL after tours, here is: sdfsdfs
   // 127.0.0.1:3000/api/v1/tours/sdfsdfs
   const message = `Invalid ${err.path}: ${err.value}.`;
   // 400 statusCode stands for bad request
   return new AppError(message, 400);
   // NOTE: here we changed the strange error message from Monggose to a human readable message
   // with isOperational set to true automatically!
};

const handleDuplicateFieldsDB = (err) => {
   // NOTE: First method to get the name of the tour: but i didn't work for me!
   // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
   // const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
   // const value = res.message.match(/(["'])(\\?.)*?\1/)[0];

   // NOTE: Second method to get the name of the tour: this works for me well!
   // const value = err.keyValue.name;
   const value = err.keyValue.name; // value has the name of the tour!
   console.log('The name of the tour is: ' + value);
   // const message = `Duplicate field value: x. Please use another value!`;
   const message = `Duplicate field name: ${value}. Please use another name!`;
   return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
   // NOTE: Object.values() takes the errors object containing all the three other objects
   // (name, difficulty, ratingsAverage) and then map() function will search in contents of
   // every of these three objects to find respected message property!
   const errors = Object.values(err.errors).map((el) => el.message);
   const message = `Invalid input data: ${errors.join('. ')}`; //to make between all these
   // error messages with dot and one space!
   return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
   // we send as many details as possible to the developer to find a solution to get ride of that!
   // NOTE: first of all, we see what is statusCode and after that, it gives us the related
   // status and message for that error!
   res.status(err.statusCode).json({
      status: err.status,
      error: err, // print the entire error
      message: err.message,
      stack: err.stack,
   });
};

const sendErrorProd = (err, res) => {
   // NOTE: Operational, trusted error: send message to the client
   // console.log(err.isOperational);

   if (err.isOperational) {
      // NOTE: first of all, we see what is statusCode and after that, it gives us the related
      // status and message for that error!
      res.status(err.statusCode).json({
         status: err.status,
         message: err.message,
      });

      // NOTE: Programming or other unknown errors: don't leak error details to client
   } else {
      // 1) Log error to the console:
      console.error('ERROR!!!', err.message);

      // 2) Send generic message:
      res.status(500).json({
         status: 'error',
         message: 'Something went very wrong!',
      });
   }
};

const globalErrorHandler = (err, req, res, next) => {
   //    console.log(err.stack); // it shows us where the error happens!

   // we have different error status Codes like 400,404,500,..., that's why we have to get the
   // error from every occurred erorr and when there is no error code for the occurred error,
   // we consider it as Error with Code 500!
   err.statusCode = err.statusCode || 500; // if it is defined, StatusCoe is what error itself has
   // when it is not defined, we consider it as 500 which means Internal Server Error!
   err.status = err.status || 'error'; // it status is defined, status takes what the error has,
   // it status is not defined, it would be 'error' which is for 500 statusCode!
   // and when it is 400 or 404 status Code, it would be 'fail' as we write it as status in our json!

   if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
   } else if (process.env.NODE_ENV === 'production') {
      // NOTE: we have three errors come from Mongoose and we have to change these errors to
      // meaningful errors for client:
      // 1) in getting a tour => when we enter a false id
      // 2) in creating a tour, when we have duplicate names for name of the tour
      // 3) when we update a tour and we enter the values which our validator doesn't accept
      // that like ratingsAverage which is between 1 to 5 and difficulty which is only
      // easy medium or difficult!

      // NOW, first function for the first error: this error has the name of CastError
      // err is the error which mongoose created!

      // NOTE: these three methods didn't work for a copy from err.
      // let error = { ...err }; // we make a hard copy of err object which created by mongoose!
      // let error = Object.assign({}, err); // we make a hard copy of err object which created by mongoose!
      // let error = { name: err.name }; // we make a hard copy of err object which created by mongoose!

      // NOTE: but this one worked => // Create a deep copy using JSON.parse() and JSON.stringify()
      let error = JSON.parse(JSON.stringify(err)); // we make a hard copy of err object which created by mongoose!
      // NOTE: This is how to handle the first error in Production mode and send a user-friendly
      // message to the client, when we enter an invalid id in URL like this one:
      // 127.0.0.1:3000/api/v1/tours/5624562645
      if (error.name === 'CastError') {
         error = handleCastErrorDB(error); // it will return error for us
         // produced by our AppError and with isOperational set to true!
         console.log('error from appError: ' + error);
      }

      // NOTE: This is how to handle the second error in Production mode and send a user-friendly
      // message to the client, when we create a new tour but with a duplicate name:
      // the name of every tour has to be unique and not to be already existed!
      // This error doesn't have any name, rather we use the code: 11000, because it was
      // created by MongoDB and not Mongoose itself!
      if (error.code === 11000) {
         // NOTE: the unique feature is error.code which is 11000 and we can get it from
         // error message in Postman.
         error = handleDuplicateFieldsDB(error); // we will create this function at top
         // response = handleDuplicateFieldsDB(res); // we will create this function at top
         // and send error which has a deep copy of our Object => it contains all the information
         console.log('error from appError: ' + error);
      }

      // NOTE: This is how to handle the third error in Production mode and send a user-friendly
      // message to the client, when we update a new tour but with three different error messages:
      // 1. A tour name must have more or equal than 10 Characters!
      // 2. Difficulty is either: easy, medium or difficult
      // 3. Rating must be below 5.0

      // This error is produced by Mongoose like the first error => CastError
      if (error.name === 'ValidationError') {
         error = handleValidationErrorDB(error);
      }

      sendErrorProd(error, res);
   }
};

module.exports = globalErrorHandler;
