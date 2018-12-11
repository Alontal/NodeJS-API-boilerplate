const logger = require('./logger'),
    E = module.exports;

E.HandleError = ( source ,err  )=>{
    // console.log('err :', err);
    // console.log('ERROR in '+source , err );
    logger.error('ERROR in '+source , {Error:  err});
    return Promise.reject(err);
}

//catch ERRORS
process.on('uncaughtException', function (err) {
    const logger = require('./logger');
    logger.error('uncaughtException', err);
    closeProcess();
  });
  process.on('unhandledRejection', (reason, p) => {
    logger.info('unhandledRejection ' + reason + ' p: ' + p);
    logger.info('reason.stack ', reason.stack || reason);
    // closeProcess();
  });
  process.on('warning', (warning) => {
    logger.error('warning :', warning.name + ' : ' + warning.message);
  });
 
  function closeProcess(){
    setTimeout(function () {
      logger.error('Closing Process');
      process.env.NODE_ENV === "production" ? process.exit(1) : {};
    }, 2000);
  }