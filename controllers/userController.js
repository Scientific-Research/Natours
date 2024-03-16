const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// MULTI STORAGE
// const multerStorage = multer.diskStorage({
//    destination: (req, file, cb) => {
//       cb(null, 'public/img/users');
//    },
//    filename: (req, file, cb) => {
//       // mimetype: 'image/jpeg',
//       const ext = file.mimetype.split('/')[1]; // that would be only extension part => jpeg
//       // NOTE: user-8347658736asb645ufghjkd-72653478234826.jpeg => combination of UserId and timestamp(), that's why it would be a guarantie that two images will never have the same name!
//       cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//    },
// });

const multerStorage = multer.memoryStorage(); // NOTE: we don't need the above definition for multerStorage anymore and we use memoryStorage() to store an image as a buffer instead! that's why i commented above statements out!

// MULTI FILTER
// NOTE: here, we testen if the uploaded file is an image or not? when it is an image => we send true to cb in multerstorage part, otherwise, we send an error!
const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true); // if this is an image, no problem! => we send true to callback
   } else {
      const error = new AppError(
         'Not an image! Please upload only images.',
         400
      );
      cb(error, false); // if this is not an image, there is problem! => we send false to callback => AN ERROR!!! 400 statusCode means bad request!
   }
};

// FINAL STEP: USING MULTER MIDDLEWARE
// const upload = multer({ dest: 'public/img/users' });
const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter,
});

// UPLOAD THE SINGLE FILE: with the photo name in DB: => and then export it to the userRoutes.js to use it there!
exports.uploadUserPhoto = upload.single('photo');

// NOTE: resize the photo for photo which are not square before upload them in browser!
exports.resizeUserPhoto = (req, res, next) => {
   if (!req.file) return next(); // when there is no request, do nothing and go to the next middleware!

   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
   // Otherwise, do the resizing: => we use the sharp package! here, we read the image from buffer momory and not disk storage anymore! => and this is a more efficient way!
   sharp(req.file.buffer)
      .resize(500, 500) // height and width needs to be the same for a square image!
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`); // to store it in users folder in project!

   next(); // from here goes directly to updateMe handler function!
};

// NOTE: Implementing this function to keep only name and email and filter out all the rest!
// it takes obj as object and allowedFields: other filelds as an array containing name and email!
// NOTE: obj is an Object and allowedFields is an array!
const filterObj = (obj, ...allowedFields) => {
   const newObj = {};
   // we have to loop through object => req.body and check if the field is an allowed filed => and if it is, simply add it to the new object and at the end, we will return that object!
   // NOTE: easiest way to loop through an object in JS is to use:
   // Object.keys(obj).forEach((el)=> {} - this Object.keys(obj) gives us all the keys of Obj as our object, which will be fields for forEach() to go through them!
   // newObj[el] = obj[el]; it means, we make the new field with the same name in newObj[] and with the same name in our obj[]
   Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) {
         newObj[el] = obj[el];
      }
   });
   return newObj;
};

// NOTE: replacing this getAllUsers with getAll() function in handlerFactory.js and then i commented this function out!
exports.getAllUsers = factory.getAll(User);
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   // res.status(500).json({
//   //    data: {
//   //       status: 'error',
//   //       message: 'This route is not yet defined! - getAllUsers',
//   //    },
//   // });

//   // NOTE: because of select:false for password in userModel.js, we don't see the password in
//   // Postman, when we get all users with this command: 127.0.0.1:3000/api/v1/users
//   const users = await User.find();
//   const Result = users.length;
//   res.status(200).json({ status: 'success', Results: Result, AllUsers: users });
// });

// The getMe comes before getOne in userRoutes.js because it is very similar to the getOne but only the difference is get One takes the req.params.id and get Me takes req.user.id, that's why with this statement: req.params.id = req.user.id; we assign the user.id to params.id and other things are exactly the same and we don't need to chnage them!
// router.get('/me', protect, getMe, getUser);
// when the getMe is before getUser, it means to execute getUser as getMe, after coming from protect(the user is logged already), we come to the getMe => params.id would be user.id, and this is what we need in getMe and at the end, getUser will be executed and because of we assigned the user.id to the params.id => the getUser would be actually getMe, because in getUser, we just need the params.id and not the user.id!
exports.getMe = (req, res, next) => {
   req.params.id = req.user.id;
   next();
};

// NOTE: we want to update the currently logged in User: => updating name and email address:
exports.updateMe = catchAsync(async (req, res, next) => {
   //  console.log(req.file); // show us all the information about uploaded photo!
   //  console.log(req.body); // show us only the name of the user and not the photo, that's why we use the multer middleware!

   // 1) Create error if user POSTs password data
   // 400 is for bad request!
   if (req.body.password || req.body.passwordConfirm) {
      return next(
         new AppError(
            'This route is not for password updates. Please use /updateMyPassword.',
            400
         )
      );
   }
   // 2) Filtered out unwanted fields names that are not allowed to be updated!
   // for non-sensitive data like name and email, we can use findByIdAndUpdate.
   // but for password as sensitive data, we use findOne() and then user.save()!
   // NOTE: x means we don't want to update all the data in body, for example: body.role:'admin' and it would be a catastrophe, when somebody can change his rule from a normal user to admin.
   // x would be only the name and email and nothing else!!! - To do that, we have to use filter to allow only these two parameters to chnage and not other parameters!
   // NOTE: with filterObj, we want to keep only name and email and filter out all the rest!
   const filteredBody = filterObj(req.body, 'name', 'email');
   if (req.file) filteredBody.photo = req.file.filename; // filename is: user-687sdf87sf.....jpeg

   // 3) Update user document
   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true, // send the new updated results back not the old one!
      runValidators: true, // Mongoose validate our input data like password,...
   });

   //   user.name = 'maximilian';
   // await user.save({ validateBeforeSave: false }); // this will deactivate all the validators
   //   await user.save();

   res.status(200).json({
      status: 'success',
      updatedUser: updatedUser,
   });
});

// NOTE: to delete the user, only thing that we have to do is to set the active flag to the false! we have created this active feature already in userSchema and is active as default!

exports.deleteMe = catchAsync(async (req, res, next) => {
   // NOTE: for deleting an account, we have to be already logged in! that's why id belong to the user is already stored conveniently in req.user.id.
   // we add also the data that we want to update here: { active: false }
   const deleteMe = await User.findByIdAndUpdate(req.user.id, {
      active: false,
   });

   res.status(200).json({
      status: 'success',
      deletedUser: deleteMe,
   });
});

// NOTE: i replace this getUser with getOne() from handlerFactoty function:
exports.getUser = factory.getOne(User); // we don't have any populate here!

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     data: {
//       status: 'error',
//       message: 'This route is not yet defined! - getUser',
//     },
//   });
// };

exports.createUser = (req, res) => {
   res.status(500).json({
      data: {
         status: 'error',
         message:
            'This route is not yet defined! - createUser - Please use /signup instead!',
      },
   });
};

// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     data: {
//       status: 'error',
//       message: 'This route is not yet defined! - updateUser',
//     },
//   });
// };

// NOTE: using factory updateOne to update the user instead of updateUser function here:
// that's whx i comment it out above.
// NOTE: updateUser is only for admin and not for other users!
// DO NOT update passwords with this!
exports.updateUser = factory.updateOne(User);

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     data: {
//       status: 'error',
//       message: 'This route is not yet defined! - deleteUser',
//     },
//   });
// };

exports.deleteUser = factory.deleteOne(User);
