const E = module.exports;
const Job = require('./job');
const logger = require('../../util/logger');

E.init = async () => {
  new Job().stopAllJobs();
};

// every 1 min go get notification from db
E.send_notifications = (cron_expr = '0 * * * * *') => {
  logger.info('starting to send notifications');
  new Job('send_notifications', new Date(), null, cron_expr).do(async () => {
    // ...
  });
};

E.update = (name, id, interval) => {
  if ((!name, id || !interval)) return 'missing name or interval';
  return new Job().update(name, id, interval);
};
