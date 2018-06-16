
let CORS_WHITE_LIST = [
    'http://localhost:3000',
    'http://evil.com/',
    undefined,
    'http://localhost:4200'
]
// above is for normal dev use , evil.com-used by CORS extension, undefined used by postman... 

// winston logger settings
let = LOG_CONFIG = {
    log_file_name: '/messages',
    log_file_name_Exceptions: '/uncaughtExceptions',
    logging_dir: 'node',
    //set the levels that will be printed in matching file
    level_log: 'debug',
    level_exception: 'debug',
    level_console: 'debug',
    level_rotate: 'info',
}

module.exports = {
    CORS_WHITE_LIST,
    LOG_CONFIG
}