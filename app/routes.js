const { userSql,  docs, email } = require('./components');
const cors_whitelist  = require('../config/config').CORS_WHITE_LIST;
const path = require('path');
require('./bootstrap');// init crons on boot

const cors = require('cors'); //add cors

const corsOptions = {
	origin: function (origin, callback) {
		if (cors_whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS for origin: '+origin));
		}
	}
};
module.exports = (app) => {

	app.use('/api/user', cors(corsOptions), userSql.userApi);
	// app.use('/api/email',  email.emailApi);
	// app.use('/api/docs',  docs.docsApi);

	//set views folder and engine
	app.set('view engine','pug');
	app.set('views', path.join(__dirname , 'views')); 

	// Redirect on failure
	app.get('/404', (req, res) =>  res.send('Unable to handle request'));
	app.get('/404', (req, res) => res.status(404).send());
	app.get('*', (req, res) => res.status(404).send());


};