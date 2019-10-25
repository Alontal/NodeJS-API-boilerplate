const schedule = require('node-schedule');
const logger = require('../../util');

// The cron format consists of:
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// e.g interval = '*/1 * * * * *'


// var job = (startTime,endTime, interval = '* * */23 * * *' , fnc ) =>  schedule.scheduleJob({ start: startTime, end: endTime,  rule: interval }, function () {
//     console.log('Time for tea!');
// });

// let startTime = new Date(Date.now() + 5000);
// let endTime = new Date(startTime.getTime() + 5000);
// job(startTime, endTime);
schedule.Job.prototype.nextDates = function (count = 1) {
  const dates = [];

  if (!this.pendingInvocations().length) {
    return dates;
  }

  const rule = this.pendingInvocations()[0].recurrenceRule;

  if (rule.nextInvocationDate) {
    // Rule is a RecurrenceRule
    let date = new Date();
    for (let i = 0; i < count; i++) {
      date = rule.nextInvocationDate(date);
      dates.push(date.toString());
    }
  } else {
    // Rule is a CronExpression
    for (let i = 0; i < count; i++) {
      dates.push(rule.next().toString());
    }
  }

  return dates;
};

// eslint-disable-next-line no-unused-vars
let JOB_COUNTER = 0;
const JOBS = {};

const scheduleJob = (options, fnc) => schedule.scheduleJob(options.name, options, fnc);

class Job {
  constructor(name, startAt, endsAt, interval) {
    this.name = name;
    this.startAt = startAt || new Date(Date.now());
    this.endsAt = endsAt || /* MAX_TIMESTAMP */ 8640000000000000;
    this.interval = interval || '* * */23 * * *';
  }

  do(fnc) {
    // let id = this.name.match(/(?<=_)(.*)(?=_)/)[0];
    if (fnc[Symbol.toStringTag] !== 'AsyncFunction') return 'async func must be provided to do();';
    JOBS[this.name] = {
      // id: id,
      name: this.name,
      job: scheduleJob({
        name: this.name,
        start: new Date(this.startAt),
        end: new Date(this.endsAt),
        rule: this.interval
      }, () => {
        fnc().then((res) => {
          logger.info('job end, results :', res);
        });
      })
    };
    logger.info(`job ${this.name} created`, JOBS);
    JOB_COUNTER++;
  }

  update(name, _id, interval) {
    if (!JOBS[name + id]) return;
    const job = JOBS[name + id];
    logger.debug('schedule. :', schedule.scheduledJobs);
    const rescheduleJob = schedule.rescheduleJob(name + id, interval);
    rescheduleJob.nextDates(5).forEach((x) => logger.debug(x));
    return { job, rescheduleJob };
  }

  stopAllJobs() {
    logger.info('stopping all jobs !!!');
    for (const key in JOBS) {
      if (JOBS.hasOwnProperty(key)) {
        const job = JOBS[key];
        logger.info('stopping job :', job.name);
        this.stop(job.name);
      }
    }
  }

  stop(job_name) {
    const canceled = JOBS[job_name].job.cancel();
    logger.info(`job '${job_name}' stopped :`, canceled);
  }
}
module.exports = Job;
