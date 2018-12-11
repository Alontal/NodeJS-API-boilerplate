_e = require('../../app/util/errorHandle');

const asyncUtil = fn =>
function asyncUtilWrap(req, res, next, ...args) {
    const fnReturn = fn(req, res, next, ...args)
    return Promise.resolve(fnReturn)
    .catch(next=>{
        _e.HandleError('asyncMiddleware', next.stack ? {stack: next.stack ,msg: next.message} : next)
        return null
    })
    // .catch(next)
}

module.exports = asyncUtil