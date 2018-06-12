var logger = require('./logger'),
    E = module.exports;
// log the error using winston and return reject to fall in catch 
E.HandleError = ( source ,err  )=>{
    logger.error('ERROR in '+source , {Error: err} );
    return Promise.reject(err);
}

