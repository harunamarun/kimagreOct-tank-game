/*
  You should not need to modify this file at all,
  although I'm sure there are ways to improve this!

  No need to know what's going on here. There are some
  sparse comments here and there if you're curious.
*/

// Express is a backend Node framework
const express = require("express");

/*
  path is one of Node's global objects (we call them modules in Node)
  No need to stress, but if you want to read more about it:
    https://nodejs.org/api/path.html
  */
const path = require("path");

// We are initializing express here
const app = express();

// Create a port
const port = process.env.PORT || 4000;

// Have it serve up the index.html file
app.use(express.static(`${__dirname}/dist`)); // otherwise load the client app

// The PORT that our server sits on
app.listen(port, function () {
  console.log("This app listening on " + port + "!");
});
