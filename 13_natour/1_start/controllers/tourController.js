const fs = require('fs');
const Tour = require('./../models/tourModel');

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

exports.getAllTours = async(req, res) => {
 try{
     const allTours = await Tour.find() ; // It works in the same manner , as we wrote query in the mongodb shell.
     res.status(200).json({
      status:"success",
      length : allTours.length ,
      data:{
        allTours:allTours
      }
     })
 }catch(err){
     res.status(400).json({
      status:"failed" ,
      message:err,
     })
 }
};

exports.getTour =async (req, res) => {
  // console.log(req.params); // the path variables or parameters are stored inside "req.params"
  try {
    const tour = await Tour.findById(req.params.id)
    // const tour = await Tour.find({"_id" : req.params.id}) // Both of above and this line of code does the same work. To make our work easier, mongoose provides us with these methods predefined inside "models" .

    res.status(200).json({
      status:"success",
      data:{
        tour:tour
      }
    })
  } catch (error) {
    res.status(404).json({
      status:"fail",
      message:error
    })
  }
};

exports.createTour = async(req, res) => {
  // const newTour = new Tour({});
  // newTour.save() // By using above these steps we used to send data to mongodb and save it using save() method which is predefined inside a document. But we can do in a more simpler and effieient way by directlt using the model instead of using document to save the data as shown below.


   // Tour is our model , and we will directly use this model predefined function i.e. "create()" which will create and save our document in the mongodb. We will use try and catch to handle the error.
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status:"success",
      data : {
        tour:newTour
      }
    })
  } catch (error) {
     res.status(400).json({
      status:"fail",
      // message:error
      message:"Invalid input data"
     })
  }

  
};

// We can use "put" or "patch" to update our data. "put" method will replace our whole old data with the new data . "patch" method will only replace the part of data(document) , which news to be updated without replacing the whole data.
exports.updateTour = async(req, res) => {
  try{
    // first parameter searches for the document to be updated, second parameter is the document part which we want to update, third parameter is an object . Using this method will return us "query object"
    const tour = await Tour.findByIdAndUpdate(req.params.id , req.body , {
      new:true , // it says that return the newly updated object, instead of the original old object.
      runValidators:true// it says after the object is successfully updated, compare or validate it with the schema.
    })

    res.status(200).json({
      status:"success",
      data:{
        tour
      }
    })
  }
  catch(error){
    res.status(404).json({
      status:"fail" ,
      message:error 
    })
  }
};

exports.deleteTour = (req, res) => {
  // if (req.params.id * 1 >= tours.length) { // this task is done by params middleware
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'invalid id',
  //   });
  // }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
