const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// NOTE: defining pug as our template engine:
app.set('view engine', 'pug');
// NOTE: using path.join, we don't care about a path with slash or without slash, path will take all into consideration!
app.set('views', path.join(__dirname, 'views'));
// app.set('views', './views');

// 1) GLOBAL MIDDLEWARES

// how to show the static files using middleware in express:
// Serving static files:
// app.use(express.static(`${__dirname}/public`)); //=> http://127.0.0.1:3000/overview.html
// NOTE: we can use path.join(__dirname) instaed of ${__dirname}:
//  using something like this which is above: path.join(__dirname, 'views')
app.use(express.static(path.join(__dirname, 'public')));
//=> http://127.0.0.1:3000/overview.html
// OR: http://127.0.0.1:3000/img/pin.png

// NOTE: to set some security for headers: I put it here at the beginning of the middlewares, where all the other comes later and get the security headers!
// Set Security HTTP headers:
// app.use(helmet());
app.use(helmet({ contentSecurityPolicy: false }));

console.log(process.env.NODE_ENV);

// WHEN WE ARE ONLY AND ONLY IN DEVELOPMENT MODE; MORGAN WILL SHOW US THIS INFO: GET /api/v1/tours/9 200 5.404 ms - 142
// IN VSCODE TERMINAL. WHEN I CHANGE IT TO PRODUCTION; IT WILL NOT SHOW US SUCH INFO.
// Development logging:
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev')); // one output as an example: GET /api/v1/tours/9 200 5.404 ms - 142
}

// NOTE: we start by creating a limiter:
// this will deny some services and especially is useful when a hacker tries to guess our credientials data like password from some yousers after too many requests! We can change the value for max to get the right one for our application.
// Limit requests from same API:
const limiter = rateLimit({
   // we specify here how many requests per IP we are going to allow in a certain amount of time:
   // below settings allows 100 requests from same IP in one hour:
   max: 100,
   // Window milisecond:
   windowMs: 60 * 60 * 1000,
   // when it is more than 100 requests in one hour => we will receive an error message:
   // StatusCode for Too many Requests is: 429 => Postman shows us this StatusCode
   message: 'Too many requests from this IP, please try again in an hour!',
});

// NOTE: we want to only apply this limiter to the routes starts with /api
app.use('/api', limiter);

// our first built-in middleware function
// NOTE: when the body is larger than 10 kilo bytes, it will not be accepted! => limit amounts of the data that comes into body:
// Body parser, reading data from body into req.body:
// app.use(express.json());
app.use(express.json({ limit: '10kb' })); // this parse the data from body

// to send the data from a form to the server, we need a middleware => urlencoded from express and the way that form send the data to the server is called urlencoded too! we need this middleware to parse the data coming from the url encoded form!
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser()); // this parse the data from cookie

// NOTE: Data sanitization against NoSQL query injection:
// we have to install this package:express-mongo-sanitize
// {
//    "email": {"$gt":""}, => this {"$gt":""} gives always true, that's why we can login when there is no email. it means we need to know only password, then we can loggin and we don't need to know the email.
//    "password": "newPassword123"
// }
app.use(mongoSanitize());

// NOTE: Data sanitization against XSS
// we have to install this package: $ npm i xss-clean =>conver html symbols to html entities, for example in Postman:  "name":"<div id='bad-code'>Name</div>", =>  "name": "&lt;div id='bad-code'>Name&lt;/div>",
app.use(xss());

// NOTE: hpp package => Http Parameter Pollution => to remove the duplication of fields problem in URL:
// Prevent Parameter Pollution => we have to use it at the end of other middlewares, because it clear up query string:
// {{URL}}api/v1/tours?sort=duration&sort=price => this solution takes only the last one and sort the prices ascendly and doesn't consider the first sort which is for duration, and therfore, the error will be gone!
app.use(
   hpp({
      whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'],
   })
);

// NOTE: what we have to do if we want to get two fields at the same time: for example:
// {{URL}}api/v1/tours?duration=5&duration=9
// when i remove this app.use(hpp());, it works, but with this, will not work.
// Solution: I have to add some parameters in form of Object to hpp => using whitelist and make exceptions for some fields.

// // how to show the static files using middleware in express:
// // Serving static files:
// // app.use(express.static(`${__dirname}/public`)); //=> http://127.0.0.1:3000/overview.html
// // NOTE: we can use path.join(__dirname) instaed of ${__dirname}:
// //  using something like this which is above: path.join(__dirname, 'views')
// app.use(express.static(path.join(__dirname, 'public')));
// //=> http://127.0.0.1:3000/overview.html
// // OR: http://127.0.0.1:3000/img/pin.png

// 1- create our own middleware function: => our global route handler before other ones:
// app.use((req, res, next) => {
//    console.log('Hello from our own middleware!');
//    next(); // calling the next() here!
// });

// 2- create our own middleware function: => our global route handler before other ones:
// Test middleware:
app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   // console.log(req.cookies); // here shows us the cookie content! we just have to reload any webpage of our website, then we can see the Cookie in the Terminal!
   // console.log(x); ONLY FOR TEST THE UNCAUGHT EXCEPTIONS IN SERVER.JS
   // when we send a request in Postman and we are in Production mode, it goes to the globalErrorHandler
   // and then production mode and this error doesn't belong to these three kinds of error => this
   // is not a known error, it is not an operational error => it doesn't go to the appError and
   // finally it goes to the else section which is for unknown errors and gives us such message
   // in Terminal: ERROR!!! { statusCode: 500, status: 'error' } and in postman: status: 'error',
   // message: 'Something went very wrong!',
   // but in development mode: it gives us a long message in Postman with details and in Terminal:
   // this message: GET /api/v1/tours 500 5.520 ms - 1294

   // console.log(req.headers);
   // NOTE: in Postman => 127.0.0.1:3000/api/v1/tours => we set the test-header = maximilian
   // and when we hit the Send => it gives us the following information:
   // {
   //    'test-header': 'maximilian',
   //    'user-agent': 'PostmanRuntime/7.36.3',
   //    accept: '*/*',
   //    'postman-token': 'ccac21cf-9dae-4507-b362-99dd1d66908c',
   //    host: '127.0.0.1:3000',
   //    'accept-encoding': 'gzip, deflate, br',
   //    connection: 'keep-alive'
   // }

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
// NOTE: the first route belongs to the viewRoutes for pug files in VIEW Part!
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

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
   // NOTE: I comment these part out, because i want to use our new created appError.js in next():
   // const err = new Error(`Can't find ${req.originalUrl} on this Server!`); // we use built-in error constructor
   // err.sttaus = 'fail';
   // err.statusCode = 404;
   // when next() recieve a parameter, express understood that, an error happened!
   // it doesn't matter which parameter, express consider it as an Error!
   // and then express will skip all other middlewares in between and go straight to our
   // global Error Handler for entire project which is located below!
   // At the moment, there is no other middleware in between, but if would be somes,
   // it will does the same! or even in other files in our project!
   // next(err);
   // NOTE: instead of using above err Code, we use our newly created AppError function in next():
   next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
   // the constructor in AppError function needs two oarameters: constructor(message, statusCode)
   // and both of them are there now in AppError().
});

// NOTE: defining a global Error Handler for entire project
// this middleware function is a first Error function => it means err comes as first Parameter
// and then comes req, res and at the end comes next
// when we have four parameters and err comes at the beginning, Express understand automatically
// that this is an error handling middleware!
// NOTE: I moved the content of this middleware to a separate file called errorController.js
// and i exported this file as globalErrorHandler here to app.js and we will test it!
app.use(globalErrorHandler);

// Export the app from here to the Server.js
module.exports = app;
