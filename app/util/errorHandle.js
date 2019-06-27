const { logger } = require("."),
  E = module.exports;

E.Handle = (message, error, source) => {
  // console.log('err :', err);
  // console.log('ERROR in '+source , err );
  logger.error(`${message} @ ${source}`, {
    Error: error
  });
  return null;
};

//catch ERRORS
process.on("uncaughtException", function(err) {
  logger.error("uncaughtException", err);
  closeProcess();
});
process.on("unhandledRejection", (reason, p) => {
  logger.info("unhandledRejection " + reason + " p: " + p);
  logger.info("reason.stack ", reason.stack || reason);
  closeProcess();
});

process.on("warning", warning => {
  logger.error("warning :", warning.name + " : " + warning.message);
});

process.on("exit", warning => {
  logger.error("warning :", warning.name + " : " + warning.message);
  // TODO: send email notify system crashed with error and stack
});

function closeProcess() {
  setTimeout(function() {
    logger.error("Closing Process");
    process.env.NODE_ENV === "production" ? process.exit(1) : {};
  }, 2000);
}
