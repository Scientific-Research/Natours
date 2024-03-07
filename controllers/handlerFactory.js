const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

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

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    // try {
    const updatedDocument = await Model.findByIdAndUpdate(id, req.body, {
      new: true, // to send the new(updated) tour to the client.
      runValidators: true,
    });

    if (!updatedDocument) {
      return next(new AppError('No document found with that ID', 404));
    }

    console.log(updatedDocument);
    res.status(200).json({
      status: 'success',
      updatedDocument: updatedDocument,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body); // recieve the data from Postman
    // doc = await newTour.save();

    console.log(newDocument);

    res.status(201).json({
      status: 'success',
      createdDocument: newDocument,
    });
  });

// NOTE: we use popOptions in addition to the Model for populate(), because populate for different get() functions(for example getTour, getUser, ...) are different!
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    // const doc = await Model.findById(id).populate(popOptions);
    // console.log(id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    console.log(doc);
    res.status(200).json({ status: 'success', OneDocument: doc });
  });

// NOTE: replacing all getAllTour/User/Review with just one general function here:
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour(a small hack here!)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const docs = await features.query; // We have to write it in this way, otherwise, it
    const Result = docs.length;

    res
      .status(200)
      .json({ status: 'success', Results: Result, AllDocuments: docs });
  });
