const express = require('express');
// require('dotenv').config();

const app = express();
const helmet = require('helmet');
const session = require('express-session');
const lusca = require('lusca');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { LUSCA_OPTIONS } = require('./config/config');
// show nice console text
// const text = require('./loadingCliText');
const { logger } = require('./app/util');

// logger.write(text);


// eslint-disable-next-line no-undef
const { PORT = 8080, SESSION_SECRET } = process.env;
// set helmet for security
app.use(helmet());
// Parse req made to app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

// create session for requests
app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

// add lusca to protect header
app.use(lusca(LUSCA_OPTIONS));

// only apply to requests that begin with /api/
app.use('/api/', apiLimiter);

// middleware to log all req made to app
app.use((req, res, next) => {
  const log = `${req.ip} ${req.hostname} ${req.method} ${req.url} `;
  if (req.method !== 'OPTIONS') logger.info('incoming request to server:', log);
  next();
});

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// catch uncaught process errors;
require('./app/util/errorHandler');

// bootstrap the services e.g crons
require('./app/bootstrap');

// start our server on port set in .env file
app.listen(PORT, () => logger.info(`Server started running... on port: ${PORT}`));
