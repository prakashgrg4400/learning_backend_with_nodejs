const fs = require('fs');
const Tour = require('./../models/tourModel');
const { json } = require('express');

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

exports.getAllTours = async (req, res) => {
  //! ==> we can query inside mongoose in two ways, they are :-  (Both of those query works the same way, but we will use first one)
  // Tour.find({duration:5 , difficulty:"easy"})
  //  ====================== OR =======================
  // Tour.find().where("duration").equals(5).where("difficulty").equals("easy") ;
  try {
    //!==> We send search parameters in our "routes" ,  so to get access to those search params, we use "req.query" . And node will give us an object of those search params in a key value pair. These search parameters are used for filtering purposes. You can console and see the data as shown below.
    console.log(req.query);
    console.log('prakash');

    //!==> But there may be other parameters beside filtering one, such as for page , linmit , sort , fields. So if we will use normal query string like find() , than we will not get any result. So we will filter our search paramas by excluding those extra params as shown below.
    // const queryObj = req.query // if we do this and change "queryObj" , than data inside "req.query" will also change because "queryObj" is only storing the refernce of object "req.query" .
    //==================== filtering ======================
    const queryObj = { ...req.query };
    const excluded = ['page', 'limit', 'sort', 'fields'];

    //!==> the delete operator deletes a property from an object, and if deletion is success it returns "true" otherwise "false" .
    excluded.forEach((excludeParam) => delete queryObj[excludeParam]);

    console.log(req.query, queryObj); // Now we will use this new updated query for filtering data as shown below.

    //!==> find() method is way of writing query, to communicate with database, and this method returns us a "query object" , and using that query object , we can perform chaining as shown above in line 38. There are other methods to like gt() , gte() , lt() , lte() , sort() etc and many more. But if we consume the "queryObject" before applying those methods as shown below than we cant do anything after the consumption is finished, So we will use these methods by storing the queryObject before consuming it as shown below from line     .
    // const allTours = await Tour.find(queryObj); // It works in the same manner , as we wrote query in the mongodb shell.

    //=========================== Advanced filtering ===============================
    //--> basic mongodb query ==> { difficulty: 'easy', duration: { $gte: '5' } }
    //--> after applying operator in route ===> { difficulty: 'easy', duration: { gte: '5' } }
    //--->  So now we need to convert the second query into first one by adding "$". And the second query is stored inside "queryObj"
    let queryStr = JSON.stringify(queryObj);
    console.log(queryStr);
    //--> replacing the operators gt, gte , lt , lte  with $gt , $gte , $lt , $lte using regular expression .
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`); // replace method also accepts callback function, and the "match" stores the data found which needs to be replaced.
    console.log(JSON.parse(queryStr));

    // const query = Tour.find(queryObj);// storing object returned by query i.e. find().
    let query = Tour.find(JSON.parse(queryStr));

    //============================ Sorting =================================
    //! http://127.0.0.1:8000/api/v1/tours?sort=-price  or   http://127.0.0.1:8000/api/v1/tours?sort=price ==> if you want to sort the data based on price in ascending order than you can just pass the query params as "sort=price" , else if you want to sort in descending order than you can pass the query params in "sort=-price" . In case if both tour have same price and in those you want another deciding factor to sort , than you can add another key name based on which you wanna sort as shown below "http://127.0.0.1:8000/api/v1/tours?sort=-price,ratingsAverage" . We have both "price" and "ratingsAverage" as property inside out tour .
    if (req.query.sort) {
      let sortBy = req.query.sort.split(',').join(' '); //
      query = query.sort(sortBy); // query.sort("-price") or query.sort("price") or query.sort("-price ratingsAverage"); if we are sending two properties based on which tour should be sorted, than at first tour will be sorted based on "price" property. But a certain tours have same price than only after that those tours will be sorted based on second property i.e. "ratingsAverage" . And you can handle wheter the data should be in ascending or descending order using "-".
    } else {
      query = query.sort('-createdAt'); // creating a default sorting based on tours created in case user doesnt sort the tours .
    }

    //============================ Fields limiting =================================
    //!==> Fields means displaying only limited data to the user, which are actually required by the user instead of providing all the data every time user request for the data. "http://127.0.0.1:8000/api/v1/tours?fields=name,duration,price,difficulty"
    if (req.query.fields) {
      const fieldQuery = req.query.fields.split(',').join(' '); // "name duration price difficulty"
      query = query.select(fieldQuery); // "name duration price difficulty" ==> if fields are given in this manner than only these four fields are selected. but if use negative sign than it means exclude that field which contains "-" . For eg query.select("-name") --> This query says that include all the fields except name field .
    } else {
      query = query.select('-__v'); // this field is given created by mongoose, and it uses this field internally . So we no need to include this field.
      //!==> We can also exclude a field in the schema, Go to "tourModel.js" and there you can see that we have excluded it using "select : false" , but if you want to overwrite this than you can use "+" sign same like "-" while sending query .
    }

    //============================== Pagination ==================================
    //==> http://127.0.0.1:8000/api/v1/tours?page=2&limit=10 ==> Here limit means that on each page there will be only 10 documents(data) .
    let page = req.query.page * 1; // its a trick to change string to number.
    let pageDataLimit = req.query.limit * 1;
    let dataSkip = (page - 1) * pageDataLimit; // This is a formula to calculate how many datas should be escaped if one page has a certain data limit.
    //! query = query.skip(10).limit(10); ==> skip says that leave 10 datas and continue from the 11th data. And limit says that only 10 data is allowed to display, so 11th to 20th data will be displayed.
    console.log('documents => ', await Tour.countDocuments());
    let totalDocuments = await Tour.countDocuments(); // counts total number of documents, returns a promise.
    if (dataSkip >= totalDocuments) {
      throw new Error('No more data available');
    }
    query = query.skip(dataSkip).limit(pageDataLimit);

    // execute query
    const allTours = await query;

    //   sending  response
    res.status(200).json({
      status: 'success',
      length: allTours.length,
      data: {
        allTours: allTours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  console.log(req.params); // the path variables or parameters are stored inside "req.params"
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.find({"_id" : req.params.id}) // Both of above and this line of code does the same work. To make our work easier, mongoose provides us with these methods predefined inside "models" .

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save() // By using above these steps we used to send data to mongodb and save it using save() method which is predefined inside a document. But we can do in a more simpler and effieient way by directlt using the model instead of using document to save the data as shown below.

  // Tour is our model , and we will directly use this model predefined function i.e. "create()" which will create and save our document in the mongodb. We will use try and catch to handle the error.
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      // message:error
      message: 'Invalid input data',
    });
  }
};

// We can use "put" or "patch" to update our data. "put" method will replace our whole old data with the new data . "patch" method will only replace the part of data(document) , which needs to be updated without replacing the whole data.
exports.updateTour = async (req, res) => {
  try {
    // first parameter searches for the document to be updated, second parameter is the document part which we want to update, third parameter is an object . Using this method will return us "query object"
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // it says that return the newly updated object, instead of the original old object.
      runValidators: true, // it says after the object is successfully updated, compare or validate it with the schema.
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// After deleting a data, its a good practice not to send anything to the clent.
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id); // this method will return a query and await will wait until the data is deleted successfully.
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
