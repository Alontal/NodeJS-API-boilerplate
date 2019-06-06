var db = require('../../../db/mysql/mysql'),
	{logger, logger} = require('../../util'),
	E = module.exports;

E.getUserByEmail = async email => {
	try {
		return db
			.get()
			.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
	} catch (error) {
		logger.error('failed to getUserByEmail', error);
		return null;
	}
};

E.getAdminsEmails = (role = 'supervisor') => {
	try {
		return db.get().query('SELECT email FROM users WHERE role = ?', [role]);
	} catch (error) {
		logger.error('failed to getAdminsEmails', error);
		return null;
	}
};

E.getAllUsers = async () => {
	try {
		return db.getTableByName('users');
	} catch (error) {
		logger.error('failed to getAllUsers', error);
		return null;
	}
};

E.updateUser = async (email, user) => {
	try {
		user.time_updated = Date.now();
		return db
			.get()
			.query('UPDATE users  SET ? WHERE email=? ', [user, email]);
	} catch (error) {
		logger.error('failed to updateUser', error);
		return null;
	}
};

E.insert = async user => {
	return db.executeSql.insertIntoTable('users', user);
};
