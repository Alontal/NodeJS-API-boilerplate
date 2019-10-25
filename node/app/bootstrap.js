const mongo = require('../db/mongo/mongo');
// const job = require('../app/components/cron/jobController');

// mongo init connection;
if(process.env.DB_MODE === 'mongo'){
  new mongo().connectToDB();
}

// start task job
// job.init();