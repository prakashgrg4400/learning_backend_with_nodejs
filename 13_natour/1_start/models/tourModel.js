const mongoose = require('mongoose');

//!====> Creating schema for tours using mongoose .
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // first parameter is saying you cannot leave this field empty, second is error message.
    unique: true, // all names must be unique otherwise , we will get error.
    trim:true
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
    required:[true , "A tour must have a summary"]
  },
  description:{
    type:String,
    trim:true
  },
  imageCover:{
    type:String,
    required:[true , "Atour must have a cover image"]
  },
  images:[String],// storing multiple images--> i.e. name of images in an array
  createdAt:{
    type:Date,
    default:Date.now()
  },
  startDates:[Date]
});

//!====> Creating modal for tour
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
