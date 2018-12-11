const E = require('email-templates'),
    nodemailer = require('nodemailer'),
    logger = require('../../app/util/logger'),
    db = require('../../db/mysql/mysql'),
    rp = require('request-promise-native'),
    _ = require('lodash');;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS
    }
});

const email = new E({
    message: {
        from: process.env.ADDRESS,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
});


class Notification {
    /*
    type = 'sms'/ 'email / 'admin',
    */
    constructor(type, title, from, to_phone, to_email, msg,  cc = null) {
        this.type = type;
        this.title = title;
        this.from = from;
        this.to_phone = to_phone;
        this.to_email = to_email;
        this.msg = msg
        if (cc) this.cc = cc;
    }

    decideWhoToSend() {
        return this.type === 'sms' ? this.to_phone : this.to_email;
    }

    buildMessage() {
        let msg = {};
        if (this.type === 'sms') {
            // its sms so send message with short description
            msg = `title: ${this.title.toString()} 
            msg:${(this.msg.substring(1, 10))}....`
        } else {
            // its email so send object to use in email template as 'locals'
            msg.title = this.title;
            msg.timestamp = new Date().toTimeString();
            msg.msg =  this.msg instanceof String ? JSON.parse(this.msg) : this.msg;
        }
        return msg;
    }

    insert() {
        logger.info('inserting notification', this);
        return db.executeSql.insertIntoTable('notifications', this)
    }

    static getByStatus(status = 0) {
        return db.executeSql.query('SELECT * FROM notifications WHERE sent = ?', [status]);
    }

    async send() {
        let to = this.decideWhoToSend();
        let msg = this.buildMessage();
        let res = []
        if (this.type == "sms" ) {
            // send sms 
            if(process.env.SEND_SMS === "true" ){
                res.push( await new Sms(this.from, to, msg).send());
            }
        } else {
            if(process.env.SEND_EMAIL === "true" ){
                res.push(await new Email(this.from, to, msg, this.cc).send());
            }
        }
        // send email
        return res;
    }
    
    updateNotificationSent(isSent,id){
        this.update({sent: isSent}, id)
    }

    update(notification, id){
        db.executeSql.query('UPDATE notifications SET ? WHERE id = ?', [notification, id  ])
    }
}

class Sms {
    constructor(from, to_phone, msg) {
        this.sms = {
            sender: from || 'Alerts plus',
            phone: to_phone,
            msg: msg
        }
    }
    async send() {
        let options = {
            method: 'GET',
            uri: 'http://.............',
            qs: this.sms,
            headers: {origin: 'http://alerts.com'} 
        }
        try {
            let result = await rp(options);
            logger.info('sms result:', result);
            return JSON.parse(result);

        } catch (error) {
            return { error }
        }
    }
}

class Email {
    /*
    * -template refer to the html template to use as email.
    *  templates located in root folder under /emails
    * -message contains {to , cc, subject... fields }
    * -locals contains parameters that we pass to each html template
    * for more info see https://www.npmjs.com/package/email-templates
    */
    constructor(from, to_email, msg, cc) {
        this.template = 'ex_template';
        this.from = from;
        this.to = to_email;
        this.locals = msg;
        if (cc) this.cc = options.cc.join();
    }
    async send() {
        try {
            let options = {
                template: this.template || template,
                message: {
                    from: this.from,
                    to: this.to,
                    cc: this.cc || null
                } || message,
                locals: this.locals || locals
            };
            let sent = await email.send(options)
            if (sent.accepted.length === 0) {
                logger.error(`email was not sent to: ${sent.rejected.join()} `)
                return null;
            }
            logger.info(`email sent to ${sent.accepted.join()}`);
            return sent;
        } catch (error) {
            logger.error('failed to send email ', { error })
            return {error};
        }
    }
}

module.exports = { Notification, Email, Sms };