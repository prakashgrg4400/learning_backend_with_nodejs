const app = require('./app');

const port = 3000;

app.listen(port, () => {
  console.log(`Starting the server at port ${port}`);
});