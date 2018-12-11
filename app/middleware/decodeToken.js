jwt = require('jsonwebtoken');

decodeToken = (req, res, next )=> {
    const token = req.headers['x-access-token'] || req.cookies['token'] || req.body.token;
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      // auth success below
      req.decoded = decoded;
      next();
    });
}

module.exports = decodeToken;