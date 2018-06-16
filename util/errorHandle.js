var logger = require('./logger'),
    E = module.exports;
// log the error using winston and return reject to fall in catch 
E.HandleError = ( source ,err  )=>{
    logger.error(source , {Error: err} );
    return (err);
}
