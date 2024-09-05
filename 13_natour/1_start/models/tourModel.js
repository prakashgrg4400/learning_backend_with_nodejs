const mongoose = require('mongoose');

//!====> Creating schema for tours using mongoose .
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // first parameter is saying you cannot leave this field empty, second is error message.
      unique: true,// all names must be unique otherwise , we will get error.
    },
    rating: {
      type: Number,
      default: 4,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
  });
  
  //!====> Creating modal for tour
  const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour ;