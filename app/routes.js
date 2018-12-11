const userApi = require('./routes/userApi'),
      notificationApi = require('./routes/notificationApi'),
      cors_whitelist  = require('../config/config').CORS_WHITE_LIST,
      decodeToken = require('./middleware/decodeToken');;

require('./controllers/jobController');// init crons on boot

const cors = require('cors'); //add cors


const corsOptions = {
  origin: function (origin, callback) {
    if (cors_whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
module.exports = (app) => {

  app.use('/api/user/', cors(corsOptions), userApi);
  app.use('/api/notification/', decodeToken, notificationApi);
  // Redirect on failure
  app.get('/404', (req, res) => {
    res.send('Unable to handle request');
  });
  app.get('/404', function (req, res) {
    res.send('404');
  });
  app.get('*', function (req, res) {
    res.send('404');
  });
}