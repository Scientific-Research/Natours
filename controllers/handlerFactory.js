const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    // try {
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      // when we give parameters to next(), it means an error happened and we give our global
      // Error App => AppError() function as this parameter and it has itself two parameters:
      // message and statusCode and we have to use return to send it back and not going forward!
      return next(new AppError('No document found with that ID', 404));
    }

    if (!doc) throw new Error('This document already deleted!');
    console.log(doc);

    res.status(200).json({
      status: 'success',
      deletedDocument: doc,
    });
  });
