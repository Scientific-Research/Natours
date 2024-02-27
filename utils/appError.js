// Our class extends the built-in Error class in JavaScript! it means Our AppError class inherit
// from the Error built-in class in JS!
class AppError extends Error {
   constructor(message, statusCode) {
      // NOTE: the instance(Object) which we create later from
      // our AppError class will take these two Parameters: message and statusCode
      // the constructor will be called everytime that we make an Object from this class!
      super(message); // NOTE: we need to call the parent Constructor, because we extendded
      // our class as child class(AppError) with a parent class(Error) and we need to call the
      // constructor of Error class as our parent class!
      // NOTE: the parameter inside the super() would be only message, because it is only
      // the built-in parameter for Error as our parent class!

      this.statusCode = statusCode;
      // NOTE: status can be 'fail' with 4* like 400 or 404 and 'error' with 5* like 500
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
   }
}
