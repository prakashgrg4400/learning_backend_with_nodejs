const fs = require('fs');
const Tour = require('./../../models/tourModel');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//!==> The dotenv "path" is not working so we are unable to put our environment variable inside node.js evnironment variable. So we are directly using the link as shown below.
// dotenv.config({ path: '../../config.env' });

// const db = process.env.DATABASE.replace('<PW>', process.env.DATABASE_PASSWORD);

mongoose
  // .connect(db, {})
  .connect(
    'mongodb+srv://taekwondo4400:Prakash1%40_2@cluster0.ioafd.mongodb.net/natour?retryWrites=true&w=majority&appName=Cluster0',
    {},
  )
  .then((conn) => {
    console.log('Connection successful');
  })
  .catch((error) => {
    console.log('coneection failed', error);
  });

  //!==> Reading file from "tours-simple.json" and turning it into js object
const tourData = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

//!===> This function will import all the data present inside "tours-simple.json", inside our database
const importTours = async () => {
  try {
    await Tour.create(tourData); // create acceps a single object, or an array of objects. Eithey way it will create document for every object within a collection.
    console.log('Import success');
  } catch (error) {
    console.log('Import failed');
  }
  process.exit();// after we call "importTour" or "deleteTour" , the process will still run even after the task is completed, so to stop the process, after the task is completed , "process.exit()" aggressively stops the process .
};

//!==> This function will delete all the documents present our database natour.
const deleteTours = async () => {
  try {
    await Tour.deleteMany(); // if no argument is passed inside deleteMany() , than it will delete all the data inside datavase.
    console.log('Delete success');
  } catch (error) {
    console.log('Delete failed');
  }
  process.exit();
};

console.log(process.argv);
//! using " node .\13_natour\1_start\dev-data\data\import-dev-data.js" will display what is inside "process.argv" i.e. an array of 
//! [
//!   'C:\\Program Files\\nodejs\\node.exe',
//!   'C:\\Desktop\\node\\13_natour\\1_start\\dev-data\\data\\import-dev-data.js'
//! ]

//!  Now if you do " node .\13_natour\1_start\dev-data\data\import-dev-data.js --import" , than the word "--import" will be stored inside "process.argv" and will look like this :-
//! [
//!   'C:\\Program Files\\nodejs\\node.exe',
//!   'C:\\Desktop\\node\\13_natour\\1_start\\dev-data\\data\\import-dev-data.js',
//!   '--import'
//! ]

//!  Same concept goes for "node .\13_natour\1_start\dev-data\data\import-dev-data.js --delete" , and "process.argv" will store data as shown below :- 
//! [
//!   'C:\\Program Files\\nodejs\\node.exe',
//!   'C:\\Desktop\\node\\13_natour\\1_start\\dev-data\\data\\import-dev-data.js',
//!   '--delete'
//! ]

//!====>  Now we will use these arrays data of "process.argv" to call the function as shown below, which we created to import and delete data from database.

if (process.argv[2] === '--import') {
  importTours();
} else if (process.argv[2] === '--delete') {
  deleteTours();
}

//!======> Now using the command line "node .\13_natour\1_start\dev-data\data\import-dev-data.js --delete" , we can delete all the documents in our database, and using the command "node .\13_natour\1_start\dev-data\data\import-dev-data.js --import" , we can import the data to our database . And the code which performs this task is written above. where :-
//! ===> we connected to database
//! ===> read json data from file
//! ===> created a function which will import all the read json data to database .
//! ===> created a function which will delete all the documents in our databse.
//! ===> To call the function "importTour" and "deleteTour" , we used "process.argv" . 



//=========================== inside process.argv =====================================
//! [
//!   'C:\\Program Files\\nodejs\\node.exe',
//!   'C:\\Desktop\\node\\13_natour\\1_start\\dev-data\\data\\import-dev-data.js'
//! ]
//  ---->  the first data i.e. "C:\\Program Files\\nodejs\\node.exe" is responsible for the execution of our node command where we use "node" keyword to perform and manage packages using node . 
// ---> the second data is the location of our current working file from the root directory of our pc i.e. "C:\\Desktop\\node\\13_natour\\1_start\\dev-data\\data\\import-dev-data.js" .