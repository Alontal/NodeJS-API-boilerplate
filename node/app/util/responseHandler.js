const { logger } = require('.');

const handleResponse = (
  operation,
  status = true,
  { data, error, logLevel = 'info', overrideMessage }
) => {
  const MSG = {
    SUCCESS: `${operation} finished Successfully`,
    FINISHED: `${operation} finished`,
    FINISHED_WITH_ERRORS: `${operation} finished with errors`
  };
  let response;
  if (error) {
    response = {
      status: false,
      message: MSG.FINISHED_WITH_ERRORS || overrideMessage,
      error
    };
  } else {
    response = {
      status,
      message: overrideMessage || (status ? MSG.SUCCESS : MSG.FINISHED),
      data
    };
  }
  // log the operation
  const level = logLevel || (!status ? 'warn' : logLevel);
  const logData = error ? { error, status } : { data, status };
  logger[level.toString()](response.message, logData);
  return response;
};

module.exports = handleResponse;
