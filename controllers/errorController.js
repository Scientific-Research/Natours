const sendErrorDev = (err, res) => {
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
   // NOTE: first of all, we see what is statusCode and after that, it gives us the related
   // status and message for that error!
   res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
   });
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
      // NOTE: first of all, we see what is statusCode and after that, it gives us the related
      // status and message for that error!
      // res.status(err.statusCode).json({
      //    status: err.status,
      //    error: err, // print the entire error
      //    message: err.message,
      //    stack: err.stack,
      // });
   } else if (process.env.NODE_ENV === 'production') {
      sendErrorProd(err, res);
   }
};

module.exports = globalErrorHandler;
