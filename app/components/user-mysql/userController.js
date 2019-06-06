const User = require('./userModel');
const {encryption,logger} = require('../../util/');

async function insertUser(user) {
	try {
		var userOldPass = user.password;
		if (!user.email || !user.password) {
			return 'You must send the username and the password';
		}
		let existingUser = await User.getUserByEmail(user.email);
		if (existingUser.length > 0) return { message: 'user exist' };
		user.iid = encryption.generateUserId();
		user.password = encryption.hashPassword(user.password);
		user.role = 'Admin';
		user.time_created = Date.now();
		let userInserted = await User.insert(user);
		if (!userInserted.affectedRows > 0)
			return 'could not insert' + userInserted;
		return {message: 'success', token: await encryption.createToken1(user)};
	} catch (error) {
		logger.error('failed to insert user ', error);
		return 'something went wrong';
	}
}

async function getByEmail(email) {
	try {
		let user = await User.getUserByEmail(email);
		logger.debug(`found user for ${email}:`, user);
		return user;
	} catch (error){
		logger.error(`failed to get user for:${email}:`, error);
	}
}

async function getAll() {
	try {
		let allUsers = await User.getAllUsers();
		return allUsers;
	} catch (error) {
		logger.error(`failed to get all users:`, error);

	}
}

const AUTH_MESSAGES = {
	NO_SUCH_USER : 'User does not exist',
	LOGIN_SUCCESS : 'User is valid :) ',
	PASSWORD_DONT_MACH: 'The username or password dont match..',
	ERROR_LOGIN: 'error accord please report this to admin if you sure you are right, you probably not '
}

async function login (email, password) {
	try {
		let res = await User.getUserByEmail(email);
		if (res.length == 0) return AUTH_MESSAGES.NO_SUCH_USER; //nu such user;
		let isValid = encryption.validPassword(password, res[0].password);
		if (!isValid) {
			logger.debug(AUTH_MESSAGES.PASSWORD_DONT_MACH);
			return AUTH_MESSAGES.PASSWORD_DONT_MACH; //password dont match;
		}	
		logger.debug(AUTH_MESSAGES.LOGIN_SUCCESS, res);
		return ({ message: 'success', token: encryption.createToken1(res) });

	} catch (error) {
		return AUTH_MESSAGES.ERROR_LOGIN;
    }   

}


module.exports = {
	insertUser,
	getByEmail,
	getAll,
	login
};
