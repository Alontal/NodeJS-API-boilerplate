const Notification = require('../../models/email/emailModel').Notification,
    logger = require('../util/logger'),
    E = module.exports;

E.insert = async (types, title, from, to_phone, to_email, msg, severity, cc) => {
    let res = [];
    for (const key in types) {
        let type = types[key];
        res.push(await new Notification(type, title, from, to_phone, to_email, msg, severity,cc).insert())
    }
    return res.map(a=>{return {success: a.affectedRows}});
}

E.send = async (type, title, from, to_phone, to_email, msg, severity) =>{
   return new Notification(type,title,from,to_phone,to_email,msg,severity).send()
}
