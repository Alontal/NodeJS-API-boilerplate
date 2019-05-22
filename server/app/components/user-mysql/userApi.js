const express = require('express');
const router = express.Router();
const { logger } = require('../../util');
const {decodeToken, asyncMiddleware} = require('../../middleware');
const {userController, userValidator} = require('./');
  
router.post(
	'/test',
	asyncMiddleware(async (req, res) => {
		res.status(200).send('It Works !!!');
	})
);

router.post(
	'/get',
	decodeToken,
	asyncMiddleware(async (req, res) => {
		userValidator.valdateUser(res.req.decoded);
		let u = res.req.decoded;
		let user = userController.getByEmail(u.email);
		if (!user) res.status(200).send('no such user');
		res.status(200).json(user);
	})
);

router.get(
	'/get-all',
	asyncMiddleware(async (req, res) => {
		// var u = res.req.decoded;
		//TODO: search in DB by iid and send user back to ui
		let users = userController.getAllUsers();
		logger.debug('res :', {
			users
		});
		res.status(200).json(users);
	})
);

// insert users with full details
router.post(
	'/insert',
	asyncMiddleware(async (req, res) => {
		let u = req.body;
		let response = await userController.insertUser(u);
		if (!response) return res.status(500).send('insertUser failed');
		logger.info('user insert response:', {
			response
		});
		res.status(200).send(response);
	})
);

// login user and return if exist token
router.post(
	'/login',
	asyncMiddleware(async (req, res) => {
		let isValidate = await userValidator.validateUser(res.req.decoded);
		const email = req.body.email;
		const pass = req.body.password;
		if (!email && !pass)
			return res.status(500).send('failed username or password');
		let response = await userController.login(email, pass);
		logger.info(`user ${email} login: `, {
			response
		});
		if (!response) return res.status(200).send(response);
		res.status(200).send(response);
	})
);

module.exports = router;
