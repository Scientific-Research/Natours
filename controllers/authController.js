const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// NOTE: create a function for Token:
const signToken = (id) => {
   return jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
   });
   // return jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
   //    expiresIn: process.env.JWT_EXPIRES_IN,
   // });
};

exports.signup = catchAsync(async (req, res, next) => {
   // NOTE: when we use catchAsync(), we don't need to use try() catch() anymore! that's why
   // i comment them out there!
   //    try {
   // const newUser = await User.create(req.body);
   // NOTE: using deconstructuring:
   const { name, email, password, passwordConfirm } = req.body;
   const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      /*
      name: req.body.name,
      email: req.body.name,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      */
   });

   // NOTE: first of all, we have installed the jsonwebtoken and now, we will use sign function
   // to create atoken:
   // first parameter in sign() function is payload as an object which is id here and we will
   // take it from newUser which we created already!
   // the next part of jwt is secret which we get it from .env file!
   // with these two, the token header will be created automatically!
   // options comes after that: expiration time, like this: JWT_EXPIRES_IN=90d 10h 5m 3s
   // the token is now ready and next step: is to send it to the client

   // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
   //    expiresIn: process.env.JWT_EXPIRES_IN,
   // });
   // here we use the newly created Token function:
   const token = signToken(newUser._id);

   res.status(201).json({
      // 201 is used for creating the user!
      status: 'success',
      // NOTE: and now, the token is ready and we have to send it to the client before user:
      token,
      User: newUser,
   });
   //    } catch (err) {
   //       status: 'fail';
   //       message: 'Error creating a new User' + err.message;
   //    }
});

// NOTE: the next step to create the signup route in which this signup function can be called!

exports.login = catchAsync(async (req, res, next) => {
   // const email = req.body.email;
   // const password = req.body.password;
   // NOTE: these are the credentials that a user send to the check...
   const { email, password } = req.body;

   // 1) Check if email and password exist:
   if (!email || !password) {
      // we use next() to declare a new error as a parameter inside it and then send it to AppError
      // function
      const message = 'Please provide email and password!';
      // return here is very important, otherwise, it goes to the res.status()... and gives
      // us the error in VSCode Terminal that it can not send two responses header at the same
      // time to the client!
      return next(new AppError(message, 400));
   }

   // 2) Check if user exists && password is correct:
   // first of all, we check, if there is an email for the user which posted:
   // we search for this user not according to its id, rather, its email.
   // { email: email }: first email is the name of the variable and the second is the variable!
   // in ES6 we can write it as abbreviation: like this: { email }
   // const user = User.findOne({ email: email });
   // this below user doesn't contain password, that's why we have to explicitly select it
   // using + operator. Now, we have the password in output as a feature belong to the user!

   const user = await User.findOne({ email }).select('+password');
   console.log(user); // now, our user has password, when we login: 127.0.0.1:3000/api/v1/users/login

   // NOTE: and now, we have to check that if the password in DB is mached with entered password
   // in Postman which user has already entered:
   // how can we compare these two together:
   // pass1234 === $2a$12$Y.2./ibZ6q2Cklhi3.y/q.WIXTibMRtRyQdm9NILGsdpwyOIncQqG
   // the only solution is that: we encrypt the plain password too and compare both encrypted
   // passwords together, //NOTE: we will do it in userModel.js and not here.

   // const correct = await user.correctPassword(password, user.password);
   if (!user || !(await user.correctPassword(password, user.password))) {
      const message = 'Incorrect email or password!';
      return next(new AppError(message, 401));
   }

   // 3) If everything is ok, send the token to the client:
   // this is our faked Token which send back to client and we get it in Postman, when we have
   // both email and password available! Otherwise, we will get the above error message in Postman!
   // const token = 'Our faked Token';
   const token = signToken(user._id);
   res.status(200).json({
      status: 'success',
      token,
   });
});

// NOTE: creating the protect middleware to preventing the unauthorized access(not logged in user)
// to the router.route('/').get(getAllTours) => it means not logged user can not see the list of
// all the tours!
// NOTE: when we use catchAsync(), then we don't need to use try()-catch() anymore!
exports.protect = catchAsync(async (req, res, next) => {
   // 1) Getting token and check if it's there => if it exists
   // first test done in app.js => console.log(req.headers);
   // To send a jsonwebtoken as a header, there is a standard to doing that:
   // we write in headers section in Postman => key: Authorization and value: Bearer asgfasgdfagsdfh
   // and then Send => in Terminal, we will see: {authorization: 'Bearer asgfasgdfagsdfh',...}
   // Actually this piece of header value is token: asgfasgdfagsdfh
   // if header exists and it starts with Bearer word:
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // how to get the second part of the authorization: I mean asgfasgdfagsdfh
      // we have to use split() function which create an array with single quotation in it
      // because there is a space between Bearer and asgfasgdfagsdfh as token and this token
      // is the second part of authorization.
      // that's why we use [1]. [0] is the Bearer itself.
      // split function with a single quotation in it in JS convert a string into an array with
      // several parts which we can access to these parts using indexes in this array.
      token = req.headers.authorization.split(' ')[1];
   }
   // console.log(token);

   // NOTE: when there is no Token, we issue an error: when there is an error, next() will take
   // us direclty to the our global Error handling middleware => AppError which we imported
   // above!

   // NOTE: how we test the error function: just remove the authorization header check mark in
   // postman and hit the Send => it runs the route for GetAllTours and firstly see the protect
   // function and then run this function, but we have already removed the auhorization header
   // it means there is no authorization header => it doesn't exist => the above if() will not
   // work, therefore, it doesn't go into it and then there will be no token => it comes to
   // this if() below and go inside and issue an error in our global error handling middleware
   // and then we will see a detailed error in Postman with below message content!
   if (!token) {
      message = 'You are not logged in! Please log in to get access.';
      // 401 statusCode means unauthorized access!
      return next(new AppError(message, 401));
   }

   // 2) Validate token => Verification
   // NOTE: In this step, we have to verify if token is already manipulated or it is the
   // right token and also if token is already expired!
   // we used the jwt.sign already and now, we use jwt.verify:
   // NOTE: we need to promisify the jsw.verify and after that, like always, await it.
   // NOTE: Our decoded Payload is here our user._id => id: '65e0fd7a89e6afc71ed7fc9f'
   const decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   console.log(decodedPayload);
   // when i copy and paste the token in jwt.io website, and then try to manipulate id
   // and finally copy and paste the new token in Authorization header in 127.0.0.1:3000/api/v1/tours
   // Bearer ey...
   // at the end, i will get the "message": "invalid signature", in Postman!
   // the next step is to show this error to the client properly!

   // 3) Check if user still exists

   // 4) Check if user changed the password after the token was issued!

   // when there is no proplem with any of these above steps, then next() will be called and will be
   // accessed to the route which will be protected => getAllTours()
   next();
});

// NOTE: this module.exports = signup doesn't work here, we have use exports.signup = ...
// module.exports = signup;
