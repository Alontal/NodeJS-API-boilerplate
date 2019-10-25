const _ = require('lodash');
const moment = require('moment');
const pug = require('pug');
const { promisify } = require('util');
const fs = require('fs');
const User = require('../user');

const readdir = promisify(fs.readdir);
const { emailModel } = require('.');
const { logger } = require('../../util');


const MESSAGES = {
  FAILED_TO_SEND: 'failed to send email...',
  EMAIL_SENT: 'failed to send email...',
  MISSING_EMAIL: 'No email address provided, check and try again'
};
/**
 * @param locals - The parameters to pass into the email. See e.g blow.
 * @param templateName - The template to use.
 * @param message: - See param below.
 * @param from - The email address of the sender. ‘sender@server.com’.
 * @param to - Comma separated list or an array of recipients email addresses that will appear on the To: field
 * @param cc - Comma separated list or an array of recipients email addresses that will appear on the Cc: field
 * @param bcc - Comma separated list or an array of recipients email addresses that will appear on the Bcc: field
 * @param {message} subject - The subject of the email
 * @param {message} text - The plaintext version of the message as an Unicode string, Buffer, Stream or an attachment-like object ({path: ‘/var/data/…’})
 * @param {message} html - The HTML version of the message as an Unicode string, Buffer, Stream or an attachment-like object ({path: ‘http://…‘})
 * @param message
 * @param {file} attachments - An array of attachment objects (see Using attachments for details). Attachments can be used for embedding images as well.
 * @example function sendEmailExample() {
 * const message = {
 * from: process.env.APP_DOMAIN,
 * to: `email@gmail.com`,
 * subject: 'Message subject',
 * };
 * const locals = {
 * name: 'test',
 * title: 'email title...',
 * subject: 'subject of message',
 * };
 * return sendEmail(message, 'default', locals);
 * }
 */
async function sendEmail(message = {}, templateName, locals) {
  try {
    message.to = await decideSender(message.to);
    const sent = await emailModel.send(message, templateName, locals);
    return sent;
  } catch (error) {
    logger.error(MESSAGES.FAILED_TO_SEND, error);
    return MESSAGES.FAILED_TO_SEND;
  }
}

/**
 * @param locals
 * @param folders - = array of templates ['clients-emails', 'sys-users-emails'].
 */
async function getEmailTemplate(locals, folders = ['default']) {
  return Promise.all(
    folders.map(async (folder, i) => {
      folder = `./server/emails/${folder}/`;
      const dir = await readdir(folder);
      return {
        name: folders[i.toString()], // use to string to prevent Object Injection Sink
        data: dir.map((f, g) => ({
          id: g,
          templateName: f,
          subject: pug.compileFile(`${folder}${f}/subject.pug`)(locals),
          template: pug.compileFile(`./${folder}/${f}/html.pug`)(locals)
        }))
      };
    })
  );
}

/**
 * @summary Check if email provided is actually a list to use.
 * @param email
 */
async function decideSender(email) {
  if (!email) {
    throw Error(MESSAGES.MISSING_EMAIL);
  }
  if (_.isString(email)) {
    if (email.includes('@')) {
      // send email to all-users
      if (email === 'all-users') {
        return (await User.getAllUsers()).map(u => u.email);
      }
      // send email to admins in  system
      if (email === 'all-admins') {
        //   ...
      }
    }
  } else if (_.isArray(email) && _.isString(email[0])) {
    return email.join(',');
  }
  return email || defaultTo;
}

module.exports = {
  sendEmail,
  getEmailTemplate
};
