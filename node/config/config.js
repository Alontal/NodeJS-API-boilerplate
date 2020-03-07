const { SERVICE_NAME, NODE_ENV, SESSION_SECRET } = process.env;

// headers to use in development , evil.com-used by CORS extension, undefined used by postman...
const LOCAL_WHITELIST = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://evil.com/', // for chrome extension no-cors
  undefined, // for postman
  'http://localhost:4200'
];
const PRODUCTION_WHITELIST = [SERVICE_NAME];

const DATE_FORMATS = {
  FULL_DATE: 'dddd, MMMM Do YYYY, HH:mm:ss',
  SHORT_DATE: 'DD MM YYYY, HH:mm:ss'
};

const CORS_WHITE_LIST = NODE_ENV === 'production' ? PRODUCTION_WHITELIST : LOCAL_WHITELIST;

const MINUTE = 60 * 1000;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const WINSTON_CONFIG = {
  maxSize: '30m',
  maxFiles: '3d',
  zippedArchive: false
};

const RATE_LIMITER = {
  windowMs: 1 * MINUTE, // 15 minutes
  max: 100
};

const LUSCA_OPTIONS = {
  // csrf: process.env.NODE_ENV === 'production' ? true : false,
  csp: {
    policy: {
      'default-src': "'self'",
      'img-src': '*'
    }
  },
  xframe: 'SAMEORIGIN',
  p3p: 'ABCDEF',
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  xssProtection: true,
  nosniff: true,
  referrerPolicy: 'same-origin'
};
const APP_SESSION = {
  secret: SESSION_SECRET || 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: WEEK // 1 week
  }
  // proxy: true // if you do ssl outside node
};

module.exports = {
  CORS_WHITE_LIST,
  LUSCA_OPTIONS,
  DATE_FORMATS,
  RATE_LIMITER,
  APP_SESSION,
  WINSTON_CONFIG
};
