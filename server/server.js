const express = require('express');
const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// eslint-disable-next-line no-unused-vars
const { logger, env } = require('./app/util');

// eslint-disable-next-line no-undef
const port = process.env.PORT;
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
 
// only apply to requests that begin with /api/
app.use('/api/', apiLimiter);

// middleware to log all req made to app
app.use((req, res, next) => {
	let log = `${req.ip} ${req.hostname} ${req.method} ${req.url} `;
	if (req.method != 'OPTIONS') logger.info('incoming request to server:', log);
	next();
});

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// catch uncaught process errors;
require('./app/util/errorHandle');

// bootstrap the services e.g crons
require('./app/bootstrap');

// start our server on port set in .env file
app.listen(port, () =>
	logger.info(`Server started running... on port: ${process.env.PORT}`)
);

// TODO add Joi
