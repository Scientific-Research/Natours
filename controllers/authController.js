const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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
  const { name, email, password, passwordConfirm, passwordChangedAt, role } =
    req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
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
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
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
  const decodedPayload = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  // console.log(decodedPayload);
  // when i copy and paste the token in jwt.io website, and then try to manipulate id
  // and finally copy and paste the new token in Authorization header in 127.0.0.1:3000/api/v1/tours
  // Bearer ey...
  // at the end, i will get the "message": "invalid signature", in Postman!
  // the next step is to show this error to the client properly!

  // 3) Check if user still exists
  // NOTE: 3-1:
  // what if the user has been deleted in the meantime, token will still exist,
  // but when the user doesn't exist anymore, we don't want to let somebody login with this token,
  // and therefore, we issue a new error message and he can not see all of our tours.

  // first of all, we check, if the user still exists: we use the id available in payload:
  // currentUser: it means, he is a new User, it means, we got this user from id in Payload!
  const currentUser = await User.findById(decodedPayload.id);
  // NOTE: when i sign a new user up, then i will have a new token for this use,
  // after that i will delete this user from Databank and will paste this new token in
  // authorization header in 127.0.0.1:3000/api/v1/tours with a Bearer prefix like this:
  // Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTMxOTA5MDUyNTQ1MD
  // Y4NWEyYmNlNyIsImlhdCI6MTcwOTM4MTg5OCwiZXhwIjoxNzE3MTU3ODk4fQ.Uv97tP-TSymBUox7mgPcX0tvu3S
  // fQxZE2VOropH5TE8
  // then, when i hit the send button, the Postman follow this route: 127.0.0.1:3000/api/v1/tours
  // and comes to the protect function and after verification, find no id for this user in
  // payload, because this user was already deleted in database => that's why will issue an
  // error message.

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed the password after the token was created!
  // NOTE: 4-1:
  // what if the user has chnaged his password after the token has benn created? that should
  // also not work! for example, imagine that someone stole the token from the user, then in
  // order to protect against that, the user changes his password. and of course, the old token
  // that has been created before changing the password, should no longer be valid!
  // this must no be accepted to access the protected route!

  // we are backed from userModel.js here in part 4 - we can call this instance method on a User:
  // the parameter is payload and we need the iat(issued at) from this payload.
  // changedPasswordAfter is a static instance method which is available on all documents and
  // we don't need to import it here from userModel.js.
  // Now, we can test it and we will see the results in Terminal!
  // we will send decodedPayload.iat as parameter to changedPasswordAfter as static instance method
  // and
  // 4) Check if user changed the password after the token was created!
  if (currentUser.changedPasswordAfter(decodedPayload.iat)) {
    return next(
      new AppError(
        'User recently changed the password! Please log in again',
        401
      )
    );
    // when i change the password, i have to log in again, because the last token is no
    // longer valid!
  }

  // To implement this task, we have to create another instance method, a method that will be
  // available on all documents, documents are instances of a model and this part of code belong
  // to the userModel and not here, that's why we will move to the userModel.js to write this
  // part of code in this Model like another static instance method:correctPassword in
  // userSchema.methods.correctPassword which is already there!
  // NOTE: so => we go to the userModel.js ...

  // when there is no proplem with any of these above steps, then next() will be called and will be
  // accessed to the route which will be protected => getAllTours()
  // NOTE: and after that all these above proccesses passed successfully, next() GRANT
  // ACCESS TO PROTECTED ROUTE => getAllTours in below route:
  // router.route('/').get(protect, getAllTours).post(createTour);
  // and also when all above processes passed successfully, we can do the following:
  // at the end, we put the entire user data on the request(req):
  // NOTE: when we assign a value to req, we can access to this value in all other middlewares!
  // when we want to pass the data from one middleware to the next one, we can put the data
  // on req.
  // NOTE: this below statement: req.user = currentUser; is very very important, because we
  // need it for the next middleware => restrictTo() to extract the role of the logged in
  // person
  req.user = currentUser;
  next();
});

// NOTE: implementing the Authorisation middleware for 'admin' and 'lead-guide':
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array and we use spread operator here: ['admin', 'lead-guide']
    // if role='user', he doesn't have any permission to delete any thing!
    // NOTE: in line 241, we have currentUser in req.user, it means we can access the role
    // property which is in userSchema and it would be this: req.user.role
    // another important note is: protect middleware is already finished before restrictTo
    // therefore, currenUser which can be one of the 'user', 'guide', 'lead-guide', 'admin'
    // is already in req.user.
    if (!roles.includes(req.user.role)) {
      // statusCode 403: means forbidden!
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    // NOTE: if user is admin or lead-guide, we will not get any error => we will go to
    // the next step using below next(), which is middleware handling itself => deleteTour
    next();
  };
};

// NOTE: How to reset a password, when we forgot it. first step:
// first of all, we write these two function and after that, we will register them in
// userRoutes.js

// The forgot password which will only recieve the email address,
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email:
  // In this point, we don't know the id of User and we know only email from user!
  // that's why we use findOne() instaed of findById().
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address!', 404));
  }
  // 2) Generate the random reset token:
  // we need to create an instance method on the user to generate the random token,
  // I will continue to write the code for this section in userModel.js
  const resetToken = user.createPasswordResetToken();
  console.log({ randomResetToken: resetToken });

  await user.save({ validateBeforeSave: false }); // this will deactivate all the validators
  // await user.save({ validateBeforeSave: false }); // this will deactivate all the validators
  // in our schema! without this, Postman gives us all the required fields as error! but with
  // this we can deactivate all the required fields and prevent from issuing the error!

  // 3) Send it to user's email:
  // NOW, we need to send the password reset token which is already stored in database via email
  // to the user => we will use a popular solution: Nodemailer
  // NOTE: here we send the plain original resetToken and not the encrypted one!
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and 
   passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      // or below parameter => these are the same!
      // email: req.body.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    console.log(err.message);

    // NOTE: we reset both the token and expires properties here!
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false }); // this will deactivate all the validators

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

// The resetPassword which will receive the token as well as new passowrd
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token:
  // NOTE: encrypt the randomTokenReset(which is not encrypted now) and compare it with encrypted one which is already store in database! we have '/resetPassword/:token'
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // NOW, get the user based this hashedToken: we have no email and no id and nothing, we have only this token to get the user from it! we query database now for this hashedToken and it will send us the user based on this token back! passwordResetToken is the encrypted password stored already in database!
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    // We want here to compare if expiration time is greater than current time? when ja, it means our token is still valid!
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password:
  // if there is no user, it means the token has been already expired!
  // 400 is bad request!
  if (!user) {
    return next(new AppError('The token is invalid or has expired!', 400));
  }

  // NOW, if there is no errors in all above steps => we can now set the password for the user:
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // and now let us delete the reset token and reset expires:
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // and now, we have to save the above values in database:
  await user.save(); // we don't want to deactivate the validator now, because we want that validator validate our above parameters!

  // 3) Update changedPasswordAt property for the user:
  // we will do this section in userModel.js as a pre save method.

  // 4) Log the user in, send JWT:
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });

  // NOTE: NOTE: NOTE: HOW WE TEST ALL THE ABOVE PROCEDURES:
  // 1- In forgotPassword tab: {{URL}}api/v1/users/forgotPassword
  // , in Postman, we enter the valid email which is available in database and then Send: we will get the success message as following:
  //   {
  //    "status": "success",
  //    "message": "Token sent to email!"
  // }

  // 2- then we go to the mailtrap.com and my account, i got already an email in inbox, I need to copy the token: b5b53a21f79ee09ac235b36940cf9ec51a757746f50e87c664a842096adfd58f from here: http://127.0.0.1:3000/api/v1/users/resetPassword/b5b53a21f79ee09ac235b36940cf9ec51a757746f50e87c664a842096adfd58f

  // 3- and then, in Postman in Reset Password tab:
  // I will paste the copied password in URL and SEND, of course with the following info in body:
  //   {
  //     "password":"newpass12345",
  //     "passwordConfirm":"newpass12345"
  //    }

  // 4- in the below window in Postman, i will get the following info too:
  //    {
  //     "status": "success",
  //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ3N2Q1MzlkOTMxMTIzMzBkNmJmMCIsImlhdCI6MTcwOTU4NTA1OCwiZXhwIjoxNzE3MzYxMDU4fQ.-lIvdt8_tC8F1e6Imx67BFF1rdyT-EniEu7uK3kvdsM"
  // }

  // 5- this new token will be in Authorization automatically and i don't need to copy and paste it manually! I go to the Get All Tours tab and the token is already there, i just need to click SEND and then all the Tours will be listed in below Window in Psotman.
});

// NOTE: we want to allow a logged in user to update his password:
exports.updatePassword = catchAsync(async (req, res, next) => {
  // the user has to enter his current password to make sure this user posseses the accont and not another person wants to update the password!

  // 1) Get user from collection
  // line 263: req.user = currentUser => req.user.id means currentUser.id
  // in userModel.js in Schema => select: false, that's why we have to include it explicitly in below statement! otherwise, we will not get it at output!
  const user = await User.findById(req.user.id).select('+password');
  // NOTE: we need the password here, because we want to compare it with the one which is already stored in the database

  // 2) Check if posted current password is correct
  // NOTE: we use the static instance method which is called => correctPassword and is available in userModel.js. This method has two inputs: candidatePassword and userPassword
  // NOTE: this mthod: correctPassword is available on all user documents and we can use it here too: candidatePassword => req.body.passwordCurrent , userPassword => user.password
  // StatusCode 401: unauthorized!
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('The entered password is wrong!', 401));
  }

  // 3) If so, update password
  // NOTE: when the entered password is correct => we can now update it!
  // Validation for both of the below passowrd are done automatically in userSchema
  // Of course, it will be done, when we save the user => await user.save();
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // NOTE: the User.findByIdAndUpdate will not work as intended!
  // We will not deactivate the validation, because we need it now to check whether password and passwordConfirm are the same or not!

  // 4) Log user in with the new password that was just updated, send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

// NOTE: this module.exports = signup doesn't work here, we have use exports.signup = ...
// module.exports = signup;
