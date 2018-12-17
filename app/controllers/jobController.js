const E = module.exports,
    Job = require('../../cron/cron_jobs/job'),
    // taskController = require('./taskController'),
    notificationController = require('./notificationController'),
    logger = require('../util/logger'),
    _ = require('lodash');


E.init = async () => {
    new Job().stopAllJobs();
   
};

E.createJobForTask = (task) => {
    // can send function to JOB 

    // let fnc = async () => taskController.startExecuteTask(task.task_uid);
    // new Job(`${task.name}_${task.task_uid}`,
    //         task.start_at,
    //         task.ends_at,
    //         task.interval)
    //     .do(fnc);
    // logger.info('job created for task=>', task);
}

// every 1 min go get notification from db
E.send_notifications  = (cron_expr = '0 * * * * *') => {
    new Job('send_notifications', new Date(), null, cron_expr).do(async function () {
        logger.info('starting to check for notifications');
        notificationController.getAndSend().then(results => {
            if (results.error) return logger.warning('notifications not sent :', results.error);
            logger.info('notifications sent :', results);
        }).catch(error => {
            logger.error('sendNotifications()', error);
        });
    });
};

E.update = (name_id, interval) => {
    if (!name_id || !interval) return 'missing name or interval'
    return new Job().update(name_id, interval);
}