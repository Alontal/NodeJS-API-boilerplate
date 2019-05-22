const {logger} = require('.'),
	chalk =require('chalk'),
	E = module.exports;

E.Handle = (message, error, source) => {
	// console.log('err :', err);
	// console.log('ERROR in '+source , err );
	logger.error(chalk.red.bgBlack.bold(`${message} @ ${source}`), { Error: error });
	return null;
};

//catch ERRORS
process.on('uncaughtException', function(err) {
	logger.error(chalk.red.bgBlack.bold('uncaughtException'), err);
	closeProcess();
});
process.on('unhandledRejection', (reason, p) => {
	logger.info(chalk.yellow.bgBlue.bold('unhandledRejection ' + reason + ' p: ' + p));
	logger.info(chalk.yellow.bgBlue.bold('reason.stack '), reason.stack || reason);
	closeProcess();
});

process.on('warning', warning => {
	logger.error(chalk.yellow.bgBlue.bold('warning :', warning.name + ' : ' + warning.message));
});

process.on('exit', warning => {
	logger.error(chalk.yellow.bgBlue.bold('warning :', warning.name + ' : ' + warning.message));
	// TODO: send email notify system crashed with error and stack
});

function closeProcess() {
	setTimeout(function() {
		logger.error(chalk.red.bgBlack.bold('Closing Process'));
		process.env.NODE_ENV === 'production' ? process.exit(1) : {};
	}, 2000);
}