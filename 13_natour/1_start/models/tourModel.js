const mongoose = require('mongoose');

//!====> Creating schema for tours using mongoose .
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // first parameter is saying you cannot leave this field empty, second is error message.
      unique: true, // all names must be unique otherwise , we will get error.
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
    },
    ratingsAverage: {
      type: Number,
      default: 4,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Atour must have a cover image'],
    },
    images: [String], // storing multiple images--> i.e. name of images in an array
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // excluding this field .
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true }, //By default res.json() doesnt includes virtual data, so if you want to display virtual data , than you can set this property to true .
    toObject: { virtuals: true },
  },
);
//                  fieldName     .  opeartins to be performed inside callback function.
tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7; // this keyword represents to each document present inside a collection. Each time request is made to database, this operation is performed for every document, but the data is not stored. But if you want to display data to the user than you can use second parameter inside "schema" i.e. "tourschema" as shown above.
});
// virtual are the data which is obtained by performing operations on existing data stored inside database. Virtual data are not stored inside databases. But it is rather used to derive or perform operations on data , without storing them in database.

//!====> Creating modal for tour
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
