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

// run on cron and send all msg that was not sent
E.getAndSend = async () => {
    // get all notification with status 0 (not sent)
    let notifications = await Notification.getByStatus(); // default is status 0 
    if(notifications.length === 0) {
        return {error: 'Cannot send notification..! no notifications to send...'}
    }
    // iterate over all notifications and send them using promise.all()
    let n = [];
    for (const key in notifications) {
        let _n = notifications[key]
        if(_n.type !=='sms') {
            let res =  await E.send(_n.type,_n.title,_n.from,_n.to_phone,_n.to_email,_n.msg,_n.severity) 
            if( isSuccess(res) ) {
                // after msg was sent mark in db that it was sent
                notification.updateNotificationSent(true,_n.id )
            }
            n.push({type: _n.type, results: res.length === 0 ? null:  res});
        }
    }
    return Promise.all(n)
}


function isSuccess(res){
    let r = false
        if(res[0]){
            if(res[0].status === "success" || res[0].status === "Success") r = true;
            if(res[0].hasOwnProperty('accepted') ) r = true;
        }
    return r; 
}