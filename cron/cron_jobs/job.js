const schedule = require('node-schedule'),
      logger = require('../../app/util/logger'),
      _ = require('lodash');

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
schedule.Job.prototype.nextDates = function(count = 1) {
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
JOB_COUNTER = 0;
JOBS = {}

const scheduleJob = (options, fnc)=> schedule.scheduleJob(options.name, options, fnc); 

class Job {

  constructor(name, start_at, ends_at, interval) {
    this.name = name;
    this.start_at = start_at || new Date(Date.now());
    this.ends_at = ends_at || /*MAX_TIMESTAMP*/ 8640000000000000;
    this.interval = interval || '* * */23 * * *';
  }

  do(fnc) {
    // let id = this.name.match(/(?<=_)(.*)(?=_)/)[0];
    if(fnc[Symbol.toStringTag] !== 'AsyncFunction') return 'async func must be provided to do();'
    JOBS[this.name] = {
      // id: id,
      name: this.name,
      job: scheduleJob({
        name: this.name,
        start: new Date(this.start_at),
        end: new Date(this.ends_at),
        rule: this.interval
      }, function () {
        fnc().then(res => {
          // logger.info('job end, results :', res);
        })

      })
    };
    logger.info(`job ${this.name} created`, JOBS);
    JOB_COUNTER++;
  }

  update(name_id, interval ){
    if(!JOBS[name_id]) return ;
    let job = JOBS[name_id];
    logger.debug('schedule. :', schedule.scheduledJobs);
    let rescheduleJob = schedule.rescheduleJob(name_id, interval)
    rescheduleJob.nextDates(5).forEach(x => logger.debug(x));
    return { job, rescheduleJob}
  }
  
  stopAllJobs(){  
    logger.info('stopping all jobs !!!');
    for (const key in JOBS) {
      if (JOBS.hasOwnProperty(key)) {
          const job = JOBS[key];
          logger.info('stopping job :', job.name);
          this.stop(job.name);
      }
    }
  }
  stop(job_name){
    let canceled = JOBS[job_name].job.cancel();
    logger.info(`job '${job_name}' stopped :`, canceled);
  }

}
module.exports = Job;