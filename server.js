console.clear();
const express = require('express'),
  logger = require('./app/util/logger'),
  app = express(),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  env = require('./app/util/env'); //manage environment for app  

const port = process.env.PORT;
// Parse req made to app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //false ==> true
app.use(cookieParser());

//middleware to log all req made to app
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now} ${req.ip} ${req.hostname} ${req.method} ${req.url} `;
  if (req.method != 'OPTIONS') logger.info('req from server:', { log });
  next();
});

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// catch uncaught process errors;
require('./app/util/errorHandle');

// bootstrap the app
require('./config/bootstrap');




//start our server on port set in .env file
app.listen(port, () => {
  logger.info(`Server started running... on port: ${port}`);
});