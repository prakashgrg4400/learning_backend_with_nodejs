const mongoose = require('mongoose');
const slugify = require('slugify');
const validatorLib = require('validator');
//====================== validators ========================
// ===> Theseare the stuffs, which checks the formate of our data, and checks if the data is entered correctly by the user. S0me of the  validators provided by the "mongoose" are :-
// string validators ==> required , maxlength , minlength  , enum
// number validators , date ==> min , max.
//==> There are more mongoose built-in validators, you can check on the documentation too .
//!====> Creating schema for tours using mongoose .
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // first parameter is saying you cannot leave this field empty, second is error message.
      unique: true, // all names must be unique otherwise , we will get error.
      trim: true,
      maxLength: [
        20,
        'Name of tour should not exceed 20 character, Your character {VALUE}', // here {VALUE} will store user input .
      ],
      minLength: [
        10,
        'Name of tour must exceed 10 character , Your character {VALUE}',
      ],
      validate: [
        validatorLib.isAlpha,
        'A tour name must contain alphabets only ',
      ], // Here "isAlpha" is function, but we do not call the function inside "validate" , we just define it and mongoose will automatically call it as we did it for "priceDiscount" schema below where we only defined the function to check the validation. You can do the sa,]me work inside an array or an object as shown below in "priceDiscount" schema . But if you are defining your own function than it will look better in object form rather than in an array form .
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          "Tour value must be 'easy' or 'medium' or 'difficult' . Your input is '{VALUE}'",
      }, // enum is used to provide a fixed option between multiple options. If the input is not found inside that option than it will throw error .
    },
    ratingsAverage: {
      type: Number,
      default: 4,
      max: [5, 'Rating should be below 5.0'],
      min: [1, 'Rating should be above 1.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    //!===> Custom validation ==========
    priceDiscount: {
      type: Number,
      //==> We have property called "validate" , where we can define our custom validation function by assigning it to "validator" key. This validator function must return either true or false. Here we are using normal function so we can get access to this object. "this" object points towards the current document which is going to be created. And if the function returns true , than the new document will be created successfully, otherwise the custom error message will be displayed to the user . We can also use external library for validation like "validator npm" which is used above in "name" schema .
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'Price discount is greate than real price i.e. price discount ==> {VALUE}',
      },
    },
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
