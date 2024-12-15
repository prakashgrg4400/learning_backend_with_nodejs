const mongoose = require('mongoose');
const slugify = require('slugify');

//!====> Creating schema for tours using mongoose .
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // first parameter is saying you cannot leave this field empty, second is error message.
      unique: true, // all names must be unique otherwise , we will get error.
      trim: true,
    },
    slug: String,
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
    secretTour: {
      type: Boolean,
      default: false,
    },
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
//==> virtuals:data which is derived from other fields(data) but is not stored inside database

//!========================= document middleware =====================
// ==> this middleware runs before saving the document in database or after saving the document in database. The pre middleware function runs before storing the document in the database, in this case we can modify our document before saving in the database. The post middleware runs after the document is successfully stored inside database.
//!==> Both "pre" and "post" middleware runs only before ".save()" and ".create()" mongoose function where "save()" function saves the document in the database , and the "create()" function first creates the document and saves the document in the database after creating the document .
tourSchema.pre('save', function (next) {
  console.log("Hello for 'pre' middleware", this);
  this.slug = slugify(this.name, { lower: true }); // Here "this" object represents the document which is going to be saved in the database. And we are using the "pre" middleware to make changes to our document before it is going to be saved in the databse .
  next();
});

//==> We can create multiple "pre" and "post" middlewares . Below is to show that .
// tourSchema.pre('save', function (next) {
//   console.log("Hello from second 'pre' middlewar");
//   next();
// });

// ==> The post middleware has acces to the document which is saved in database.
tourSchema.post('save', function (doc, next) {
  console.log('Post middleware --> ', doc);
  next();
});

//!============================== Query middleware ===============================
//==> This middle works for the "find" method which is used to filter our data based on the query object inserted inside it. But it will not run for other find methods like "findOne" , "findMany" etc. SO to make it work for all find methods we will use regular expression as shown below. Or we can create a "pre" query middleware for all the "find" methods but it is a tedious
// tourSchema.pre('find', function (next) {
//   console.log("Checking query middleware from 'Model' ");
//   this.find({ secretTour: { $ne: true } }); // This middleware will be executed before the "find" query is executed. Here "this" is the query object .
//   next();
// });

//==> Here we are using regular expression, so it will run for all the query function starting from "find" . The "this" object refers to the query object. And "docs" refers to the all the documents present inside our database . And we can get access to it after the query is executed successfully using "post" query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start}`);
  // console.log(docs);// this docs is all the documents present inside our database .
  next();
});

//!============================= Aggregate middleware =============================
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // Now we will add new "stage" in this pipeline which will be executed in the beginning of the pipeline stage, by adding new stage at the begining of the array using "unshift" method, which adds the data at the bginning if the array .
  console.log('From Aggregae middleware ==> ', this.pipeline()); // Here "this" is the "aggregate object" . And inside this object there is a method called "pipeline" , which stores all our pipeline stages which we wrote in the "controller" for aggregation in an array format .
  next();
});

//!====> Creating modal for tour
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

//===> There are four types of middleware in mongoose. They are "document middleware" , "aggregate middleware" , "query middleware" and "model middleware" .
