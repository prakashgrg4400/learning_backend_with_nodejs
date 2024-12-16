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

const port = process.env.PORT || 3000; // this is how we use "environment variable" .

app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});

// node --env-file=config.env server.js ==> Our current "dotenv" module is unable to load environment variables to our "process.env" . So we are using the above command to load the environment variable from the ".env" file using above command . You can add multiple files using ==> "node --env-file=config.env --env-file=.env server.js" .  You can remove or comment the "dotenv" codes

// Above command "node --env-file=.env server.js" , only loads the environment variable once to process.env and runs the server. But if we make changes to the code than it does not restart the server, and if we restart the server using "nodemon" or "node server.js" than the previously loaded "environment variables" will disappear. So it is also not a good thing to use(personal opinion) .  But the problem created by "dotenv" file is resolved by providing a proper path using "__dirname" as shown above. So keep on using "dotenv "

// =========> Node js debugger  ==> "ndb" is a npm package which helps us to debug the nodejs code. You can simple run it using "ndb server.js" . Or define your own in the package.json as script{debug:ndb server.js} . Dont install it as a development dependencies. Instead intall it globally or as a development dependencies as "npm install ndb --save-dev" .
