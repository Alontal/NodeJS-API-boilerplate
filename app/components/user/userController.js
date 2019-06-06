const { userModel } = require('.');
const { encryption, logger } = require('../../util');
const { emailController } = require('../email/index');
const _ = require('lodash');

const MESSAGES = {
	FAILED: 'Error accord !',
	USER_EXIST: 'User exist',
	USER_NOT_FOUND: 'User not found',
	PASS_DONT_MATCH: 'Password dont match..',
	PASSWORD_RESET:'If this email linked to an account, instructions for reseting your password were sent',
	PASSWORD_RESET_FAILED:'Failed to update password, please try again or contact support',
	PASSWORD_RESET_SUCCESS:'Password was updated!',
	PASSWORD_RESET_SAME_PASSWORD:'You cant choose your current password',
	PASS_NOT_PROVIDED: 'Missing username or password',
	SUCCESS: 'Process end Successfully',
	USER_LOG_IN_SUCCESS: email =>
		`User ${email} Successfully passed authentication`,
	FAILED_TO: to => 'failed to... ' + to
};

async function insert(user) {
	try {
		let userOldPass = user.password;
		if (!user.email || !user.password) {
			return MESSAGES.PASS_NOT_PROVIDED;
		}
		const existingUser = await getByEmail(user.email);
		if (existingUser) return { message: MESSAGES.USER_EXIST };
		user.password = encryption.hashPassword(user.password);
		const inserted = await userModel.insert(user);
		if (!inserted) throw Error(MESSAGES.FAILED_TO('insert user'));
		logger.info('user inserted  :', inserted);
		const loggedUser = await login(user.email, userOldPass);
		return loggedUser || inserted;
	} catch (error) {
		logger.error(MESSAGES.FAILED_TO('insert user'), error);
		return MESSAGES.FAILED_TO(error.name);
	}
	
}

async function login(email, password) {
	try {
		const user = await getByEmail(email);
		if (!user) return null; //nu such user;
		if (!encryption.validPassword(password, user.password)) {
			logger.debug(MESSAGES.PASS_DONT_MATCH);
			return null; //password dont match;
		}
		logger.debug(MESSAGES.USER_LOG_IN_SUCCESS(email), user.toObject());
		const dataToDecode = _.omit(user.toObject(), ['password']); // dont include pass in user object
		return {
			message: MESSAGES.SUCCESS,
			token: encryption.createToken(dataToDecode)
		};
	} catch (error) {
		logger.error(MESSAGES.FAILED, error);
		return MESSAGES.FAILED;
	}
}
async function getByEmail(email, options) {
	try {
		let user = await userModel.getUserByEmail(email, options);
		logger.debug(user ? `get user for ${email}: ${user}`: `did not found user for ${email}`);
		return user;
	} catch (error) {
		logger.error(MESSAGES.FAILED_TO(`get user for ${email}`), error);
		return MESSAGES.FAILED_TO(`get user for ${email}`);
	}
}

async function getById(id) {
	try {
		let user = await userModel.model.findById(id);
		logger.debug(`found user for ${id}:`, user._doc || null);
		return user;
	} catch (error) {
		logger.error(MESSAGES.FAILED_TO(`get user for ${id}`), error);
		return;
	}
}

async function getAll() {
	try {
		let allUsers = await userModel.getAllUsers();
		return await allUsers;
	} catch (error) {
		logger.error(MESSAGES.FAILED_TO('get all users:'), error);
		return MESSAGES.FAILED_TO('get all users:');
	}
}

async function generateResetPasswordLink(email) {
	try {
		let user = await getByEmail(email);
		if(user && user.active){
			let refreshToken = encryption.createToken({ id: user._id, email: user.email }, '1h');
			const resetLink = process.env.NODE_ENV === 'production' ? `..../api/user/password-reset/${refreshToken}`:`localhost/api/user/password-reset/${refreshToken}`;
			const message = {
				from: process.env.APP_DOMAIN,
				to: user.email,
				subject: 'Password reset',
			};
			const locals = {
				name: user.firstName,
				title: 'Password Reset Request',
				link: resetLink
			};
			//Send email to user with info
			let sent = await emailController.sendEmail(message,'resetPassword',locals);
		}
		// will send this message no matter the result
		return {
			message: MESSAGES.PASSWORD_RESET
		};
	} catch (error) {
		logger.error(MESSAGES.FAILED_TO('generate reset password link:'), error);
		return {
			message: MESSAGES.PASSWORD_RESET
		};
	}
}

async function resetPassword(email, newPassword, oldPassword) {
	try {
		const hash = encryption.hashPassword(newPassword);
		const sameAsOldPassword = encryption.validPassword(newPassword, oldPassword);
		if(sameAsOldPassword){ //user cant set his current password as new password
			return {
				message: MESSAGES.PASSWORD_RESET_SAME_PASSWORD
			};
		}
		const passwordUpdated = await userModel.updateBy({ email: email }, { password: hash }, { new : true });
		if(!encryption.validPassword(newPassword, passwordUpdated.password)){
			return {
				message: MESSAGES.PASSWORD_RESET_FAILED
			};
		}
		return {
			message: MESSAGES.PASSWORD_RESET_SUCCESS
		};

	} catch (error) {
		logger.error(MESSAGES.FAILED_TO('reset user password:'), error);
		return {
			message: MESSAGES.PASSWORD_RESET_FAILED
		};
	}

}

module.exports = {
	MESSAGES,
	insert,
	getByEmail,
	getById,
	getAll,
	login,
	generateResetPasswordLink,
	resetPassword
};