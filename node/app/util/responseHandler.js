const { logger } = require('.');

const handleResponse = (operation, status = true, {
  data, error, logLevel = 'info', overrideMessage
}) => {
  const MSG = {
    SUCCESS: `${operation} finished Successfully`,
    FINISHED: `${operation} finished`
  };
  let response;
  if (error) {
    response = {
      status: false,
      message: `${operation} failed with errors` || overrideMessage,
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
  const log = logLevel || (!status ? 'warn' : logLevel);
  const logData = error ? { error, status } : { data, status };
  logger[log.toString()](response.message, logData);
  return response;
};

module.exports = handleResponse;
