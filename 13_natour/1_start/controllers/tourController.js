const fs = require('fs');
const Tour = require('./../models/tourModel');
const { json } = require('express');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchError');
const AppError = require('../utils/appError');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//-->Now we will use this function inside "param middleware" as a middleware function. And this will run before controller i.e. route handeler. You might have instead of doing it with middleware , we could had just create a function and called them inside every controller to check if id is valid or not. Yes you could have done that, but it will go against express working policy where working with middleware is recommended.
// exports.checkId = (req , res , next , val)=>{
//   const id = Number(req.params.id); // by default id is in string, or  (req.params.id*1) does the same trick as Number().
//     console.log(`Tour id is : ${val}`);

//   if (req.params.id * 1 >= tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }
//   next() ;
// }

// exports.checkBody = (req , res , next)=>{
//   console.log(req.body);
//   if(!req.body.name || !req.body.price)
//   {
//     return res.status(404).json({
//       status:"fail",
//       message:"name or price not found"
//     })
//   }
//   next();
// }

//!==> This middleware is used to provide a default data of tours based on "rating and price" , in case user hit this route
exports.getTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //! ==> we can query inside mongoose in two ways, they are :-  (Both of those query works the same way, but we will use first one)
  // Tour.find({duration:5 , difficulty:"easy"})
  //  ====================== OR =======================
  // Tour.find().where("duration").equals(5).where("difficulty").equals("easy") ;
  // try {
  //!==> We send search parameters in our "routes" ,  so to get access to those search params, we use "req.query" . And node will give us an object of those search params in a key value pair. These search parameters are used for filtering purposes. You can console and see the data as shown below.
  // console.log(req.query);
  // console.log('prakash');

  //!==> But there may be other parameters beside filtering one, such as for page , linmit , sort , fields. So if we will use normal query string like find() , than we will not get any result. So we will filter our search paramas by excluding those extra params as shown below.

  //============================= Using class to implement the reusable features like "filter" , "sort" etc =======================
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .pagination()
    .fields();

  console.log("Checking query middleware from 'controller' ");

  // execute query
  const allTours = await features.query;

  //   sending  response
  res.status(200).json({
    status: 'success',
    name: 'Prakash',
    length: allTours.length,
    data: {
      allTours: allTours,
    },
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err,
  //   });
  // }
});

exports.getTour = catchAsync(async (req, res, next) => {
  console.log(req.params); // the path variables or parameters are stored inside "req.params"
  // try {
  const tour = await Tour.findById(req.params.id);
  // const tour = await Tour.find({"_id" : req.params.id}) // Both of above and this line of code does the same work. To make our work easier, mongoose provides us with these methods predefined inside "models" .

  //!===> Some times we might get "null" tours instead of receiving an error message if the tour is not available while searching using id, so to handle those null tours we will be using below code .
  if (!tour) {
    return next(new AppError('No such tour exists', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});

//===> This code is kept in a separate file making it more usable .
// const catchAsync = (func) => {
//   return (req, res, next) => {
//     func(req, res, next).catch((err) => next(err));
//   };
// };

//!===> Refactoring code for proper error handeling by removing try and catch, and creating more custom error handler for async functions
exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save() // By using above these steps we used to send data to mongodb and save it using save() method which is predefined inside a document. But we can do in a more simpler and effieient way by directlt using the model instead of using document to save the data as shown below.

  // Tour is our model , and we will directly use this model predefined function i.e. "create()" which will create and save our document in the mongodb. We will use try and catch to handle the error.
  // try {
  //   const newTour = await Tour.create(req.body);
  //   res.status(201).json({
  //     status: 'success',
  //     data: {
  //       tour: newTour,
  //     },
  //   });
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Invalid input data' + error,
  //   });
  // }

  //!======> New code after refactoring above try and catch code, by using another function as a wrapper to handle error for our async functions . This cway code will be much more cleaner and maintainable .
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

// We can use "put" or "patch" to update our data. "put" method will replace our whole old data with the new data . "patch" method will only replace the part of data(document) , which needs to be updated without replacing the whole data.
exports.updateTour = catchAsync(async (req, res, next) => {
  // try {
  // first parameter searches for the document to be updated, second parameter is the document part which we want to update, third parameter is an object . Using this method will return us "query object"
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // it says that return the newly updated object, instead of the original old object.
    runValidators: true, // it says after the object is successfully updated, compare or validate it with the schema.
  });

  if (!tour) {
    return next(new AppError('No such tour exists', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});

// After deleting a data, its a good practice not to send anything to the clent.
exports.deleteTour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findByIdAndDelete(req.params.id); // this method will return a query and await will wait until the data is deleted successfully.

  if (!tour) {
    return next(new AppError('No such tour exists', 404));
  }
  res.status(200).json({
    status: 'success',
    data: null,
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});

//==> Below controller is used for aggregation pipeline. It is basically a collection of data(documents) , with a summary of all the data avaiable. pipeline refers to the process in which all the documents under goes through different phases such as "match" , "group" , "sort" etc. This stages can be repeated too. this aggregation pipeline is a feature of mongodb, and we can use this feature through mongoose .
exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
  console.log('prakash');
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4 } } },
    {
      $group: {
        //!==> This "_id" is used to group our data based on the value assigned to the "_id" . The values are the "field" name of a document .
        // _id: 'all',
        // _id: '$difficulty', // Now our documents will be grouped or separated based on difficulty level i.e. "hard" , "medium" , "difficulty" .
        _id: { $toUpper: '$difficulty' }, // "$toUpper" is used to change the data to upper case .
        numOfTour: { $sum: 1 },
        numOfRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } }, // sorting is done based on the data present inside "$group" fields, but based on the present inside database i.e. documents . "1" = ascending order , "-1" = descending order
    // { $sort: { avgPrice: -  1 } },

    // { $match: { _id: { $ne: 'EASY' } } }, // this is to show that a "stage" can be repeated .  And the execution proce is top to bottom i.e. $match --> $group --> $sort --> $match . "$ne" means "not equal to".
  ]);

  console.log('stats => ', stats);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // } catch (err) {
  //   console.log('gurung');
  //   res.status(404).json({
  //     status: 'fail load',
  //     message: err.message || err,
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  console.log(req.params);
  let year = req.params.year * 1; //2021 ;
  let plan = await Tour.aggregate([
    { $unwind: '$startDates' }, // this stage helps us to create separate documents for all the values present inside an array
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // $month stage automatically filters only month from a date containing year-month-day
        numOfTour: { $sum: 1 }, // we are adding all the tours occuring in same month based on "_id" .
        tourNames: { $push: '$name' }, // $push stage helps us to create an array , push the name of tour .
      },
    },
    {
      $addFields: { month: '$_id' }, // If we want to add new field than we use this stage .
    },
    {
      $project: { _id: 0 }, // this stage helps us to decide which field to display . 0 for to hide the field, and 1 for showing the field
    },
    {
      $sort: { numOfTour: -1 }, // here we are sorting the group of tours based on number of tours each month
    },
    {
      $limit: 1, // this stage says how many documents we want to display i.e. 1 document in this case
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  // } catch (err) {
  //   console.log('prakash => ', req.params);
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
