const userApi = require('./routes/userApi'),
      cors_whitelist  = require('../config/config').CORS_WHITE_LIST;

var cors = require('cors'); //add cors


var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
module.exports = (app) => {

    app.use('/api/user/', cors(corsOptions),  userApi);
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