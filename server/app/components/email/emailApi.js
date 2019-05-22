const express = require('express');
const router = express.Router();
const {auth, asyncMiddleware} = require('../../middleware');
const { logger } = require('../../util');
const { emailController } = require('.'	);
  
router.get(
	'/test',
	asyncMiddleware(async (req, res) => {
		res.status(200).send('It Works !!!');
	})
);

router.get(
	'/send',
	asyncMiddleware(async (req, res) => {
		emailController.sendEmail(message, templateName)
	})
);

router.get(
	'/get-templates',
	asyncMiddleware(async (req, res) => {
		emailController.getEmailTemplate(locals, folders);
	})
);

module.exports = router;
