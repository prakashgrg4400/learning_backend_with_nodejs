const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/config.env` });
// dotenv.config();

// console.log('database => ', process.env);

const db = process.env.DATABASE.replace('<PW>', process.env.DATABASE_PASSWORD);

mongoose.connect(db, {}).then((con) => {
  // console.log(con.connections);
  console.log('connection successfull');
});
// .catch((err) => {
//   console.log('Database connection failed => ', err);
// });

const port = process.env.PORT || 3000; // this is how we use "environment variable" .

let server = app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});

//==> Sometimes there might be unexpected error related to promises or async function which is not handled inside "global error middleware function" . And these errors might occur unexpectedly. So to handle those unexpected errors i.e. async or promises related error, we use event listener i.e. "unhandledRejection". This event is triggered for all those promises whose rejection or catch function is not handled, than it will directly trigger this event i.e. "unhandledRejection" . When this event is triggered than the callback function i.e. second argument will be automatically called and executed.
process.on('unhandledRejection', (err) => {
  console.log(
    'Handeling unhandled Promises(async) => ',
    err.name,
    ' ',
    err.message,
  );
  console.log('Unhandled rejection !!!');
  // process.exit(1); // this line is saying to terminate all the request and shut down the server. exit function acceptes two values i.e. 0 and 1 . "0" says that the request was successfully completed and terminates the server. "1" says that an unexpected error occured and was unable to complete the request and terminates(shut downs) the server. But this way shutting down the server is not good. So the proper way is shown below .
  server.close(() => {
    //==> This is the proper way of shutting down the server. Here  we are first closing the server, by completing all the pending requests which were not affected by the error, after the pending request is completed, than only we are shutting down or terminating the server.
    process.exit(1);
  });
});

// node --env-file=config.env server.js ==> Our current "dotenv" module is unable to load environment variables to our "process.env" . So we are using the above command to load the environment variable from the ".env" file using above command . You can add multiple files using ==> "node --env-file=config.env --env-file=.env server.js" .  You can remove or comment the "dotenv" codes

// Above command "node --env-file=.env server.js" , only loads the environment variable once to process.env and runs the server. But if we make changes to the code than it does not restart the server, and if we restart the server using "nodemon" or "node server.js" than the previously loaded "environment variables" will disappear. So it is also not a good thing to use(personal opinion) .  But the problem created by "dotenv" file is resolved by providing a proper path using "__dirname" as shown above. So keep on using "dotenv "

// =========> Node js debugger  ==> "ndb" is a npm package which helps us to debug the nodejs code. You can simple run it using "ndb server.js" . Or define your own in the package.json as script{debug:ndb server.js} . Dont install it as a development dependencies. Instead intall it globally or as a development dependencies as "npm install ndb --save-dev" .
