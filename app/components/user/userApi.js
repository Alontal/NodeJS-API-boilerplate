const express = require('express');
const router = express.Router();
const logger = require('../../util/logger');
const { userController, userValidator } = require('.');
const { auth, asyncMiddleware } = require('../../middleware');
const { encryption, responseHandler } = require('../../util');

// insert users with full details
router.post(
	'/insert',
	auth.decodeToken, // decode the token to data
	auth.loadUserFromToken, // fetch user from db by token data
	auth.andRestrictTo(['admin']), //check user type meet given value;
	asyncMiddleware(async (req, res) => {
		const user = req.body;
		const validation = userValidator.validateUserInsert(user);
		if (validation.length > 0)
			return res.status(200).send(responseHandler.send(validation));
		const response = await userController.insert(user);
		res.status(200).send(responseHandler.send(response));
	})
);

// login existing user and return token
router.post(
	'/login',
	asyncMiddleware(async (req, res) => {
		const user = req.body;
		const validation = userValidator.validateUserLogin(user);
		if (validation.length > 0) return res.status(500).send(validation);
		const response = await userController.login(user.username, user.password);
		res.status(200).send(responseHandler.send(response));
	})
);

router.get(
	'/current',
	auth.decodeToken,
	auth.loadUserFromToken, // fetch user from db by token data
	asyncMiddleware(async (req, res) => {
		res.status(200).send(responseHandler.send(req.user));
	})
);

router.post(
	'/get',
	auth.decodeToken,
	auth.loadUserFromToken,
	auth.andRestrictTo(['admin']),
	asyncMiddleware(async (req, res) => {
		// let u = res.req.authenticatedUser; // need to check
		let filters = req.body.filters;
		if (Object.keys(filters).length === 0) {
			//user have to provide filter, because its return just one user
			return res
				.status(200)
				.send(responseHandler.send('please provide at least one filter'));
		}
		let response = await userController.getUser(filters, { password: 0 }); // wont be able to get the password hash
		res.status(200).send(responseHandler.send(response));
	})
);

router.post(
	'/get-all',
	auth.decodeToken,
	auth.loadUserFromToken,
	auth.andRestrictTo(['admin']),
	asyncMiddleware(async (req, res) => {
		let filters = req.body;
		let response = await userController.getAll(filters);
		res.status(200).send(responseHandler.send(response));
	})
);

router.post(
	'/reset-password',
	asyncMiddleware(async (req, res) => {
		const username = req.body.username;
		const response = await userController.generateResetPasswordLink(username);
		res.status(200).send(responseHandler.send(response));
	})
);

router.get(
	'/password-reset/:token',
	asyncMiddleware(async (req, res) => {
		res.render('resetPassword', { token: req.params.token });
	})
);

router.post(
	'/reset-user-password',
	asyncMiddleware(async (req, res) => {
		try {
			const token = encryption.verifyToken(req.headers['x-access-token']);
			let user = await userController.getUser({ username: token.username });
			const newPassword = req.body.newPassword;
			const newPasswordConf = req.body.newPasswordConf;
			const passwordValidation = await userValidator.validatePasswordReset(
				newPassword,
				newPasswordConf
			);
			if (passwordValidation.length > 0) {
				return res.status(200).send(passwordValidation);
			}
			const response = await userController.resetPassword(
				token.username,
				newPassword,
				user.password
			);
			res.status(200).send(responseHandler.send(response));
		} catch (error) {
			res
				.status(403)
				.send('Expired, Please start the process again or contact support');
		}
	})
);

module.exports = router;
