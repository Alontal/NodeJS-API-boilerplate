const express = require('express'),
      router = express.Router(),
      decodeToken = require('../middleware/decodeToken'),
      logger = require('../util/logger'),
      asyncMiddleware = require('../middleware/asyncMiddleware'),
      notificationController = require('../controllers/notificationController');

router.post('/getAndSend', asyncMiddleware(async (req, res) => {
      let sent = await notificationController.getAndSend();
      res.send(sent);
}));

router.post('/send', asyncMiddleware(async (req, res) => {
      let msg = req.body.message;
      let sent = await notificationController.send(msg.type, msg.title, msg.from, msg.to_phone, msg.to_email, msg.msg, msg.severity, msg.array);
      res.send(sent);
}));

router.post('/insert', asyncMiddleware(async (req, res) => {
      logger.debug('req notification', req.body.notification);
      if(!req.body.notification) return res.status(500).send('missing');
      let n = req.body.notification;
      let sent = await notificationController.insert(
            n.types,
            n.title,
            n.from,
            n.to_phone,
            n.to_email,
            n.msg,
            n.severity,
            n.cc);

      res.send(sent);
}));

module.exports = router;      
