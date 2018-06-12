const dotenv = require('dotenv'),
    fs = require('fs'),
    path = require('path'),
    logger = require('./logger');

logger.info('process.env.NODE_ENV :', process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
    logger.info('loading settings for Test ');
    dotenv.config(); //load local settings
} else {
    logger.warn('loading settings for production ');
    var env_dir = path.resolve('/var/env/.env.production');
    if (!fs.existsSync(env_dir)) {
        logger.error('no env file found on server.. aborting process..', env_dir, );
        process.exit(1)
    }
    dotenv.config({ path: env_dir })//load production 
}
if (dotenv.error) {
    throw dotenv.error
}
