const mongo = require('../db/mongo/mongo');
// const job = require('../app/components/cron/jobController');

//mongo init connection;
new mongo().connectToDB();

// start task job
// job.init();