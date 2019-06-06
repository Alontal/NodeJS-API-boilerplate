const E = module.exports,
	Job = require('./job'),
	logger = require('../../util/logger');

E.init = async () => {
	new Job().stopAllJobs();
};

// every 1 min go get notification from db
E.send_notifications  = (cron_expr = '0 * * * * *') => {
	logger.info('starting to send notifications');
	new Job('send_notifications', new Date(), null, cron_expr).do(async function () {
		//...
	});
};

E.update = (name, id, interval) => {
	if (!name, id || !interval) return 'missing name or interval';
	return new Job().update(name, id, interval);
};