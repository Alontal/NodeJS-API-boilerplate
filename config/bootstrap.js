const mongo = require('../db/mongo/mongo'),
      job = require('../app/controllers/jobController');

// mongo init connection;
new mongo().connectToDB();

// start task job
// job.init();
// job.startTestsEveryXTime();
job.send_notifications();