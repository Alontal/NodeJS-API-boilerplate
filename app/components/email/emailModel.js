const Email = require('email-templates');
const nodemailer = require('nodemailer');
const { logger } = require('../../util');
const path = require('path');

const transports = {
	default: nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_ADDRESS,
			pass: process.env.EMAIL_PASS
		}
	}),
	// secondary: nodemailer.createTransport({
	// 	service: 'gmail',
	// 	auth: {
	// 		user: ...
	// 		pass: ...
	// 	}
	// })
};

const email = new Email({
	message: {
		from: process.env.APP_DOMAIN
	},
	// uncomment below to send emails in development/test env:
	send: true,
	htmlToText: false,
	transport: transports['default'],
});

send = async (message, templateName, locals, transport_name = 'default') => {
	try {
		if(transport_name) email.config.transport = transports[transport_name.toString()];
		let dir = path.join(__dirname, '../', '../', '../','emails',templateName);
		return await email.send({
			template: dir,
			message: message,
			locals: locals
		});
	} catch (error) {
		logger.error('error sending email', error);
		return null;
	}
};

module.exports = {
	send
};