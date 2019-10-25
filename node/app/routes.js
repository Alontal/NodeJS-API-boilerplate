// const path = require('path');
const cors = require('cors'); // add cors
const { user } = require('./components');
const { CORS_WHITE_LIST } = require('../config/config');
require('./bootstrap'); // init crons on boot

const corsOptions = {
  origin(origin, callback) {
    if (CORS_WHITE_LIST.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS for origin: ${origin}`));
    }
  }
};
module.exports = app => {
  app.use('/api/user', cors(corsOptions), user.userApi);
  // app.use('/api/email',  email.emailApi);
  // app.use('/api/docs',  docs.docsApi);

  // set views folder and engine
  // app.set('view engine', 'pug');
  // app.set('views', path.join(__dirname, 'views'));

  // Redirect on failure
  app.get('/404', (req, res) => res.send('Unable to handle request'));
  app.get('/404', (req, res) => res.status(404).send());
  app.get('*', (req, res) => res.status(404).send());
};
