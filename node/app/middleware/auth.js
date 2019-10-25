const { logger, encryption } = require('../util');

const MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  MISSING_TOKEN: 'No token provided, create new token and try again.',
  AUTHENTICATION_FAILED: 'Failed to authenticate.',
  UNAUTHORIZED_ATTEMPT: (url, email, id) =>
    `Unauthorized attempt was blocked trying access ${url} was made by ${email} id:${id}`
};

/**
 * @param req
 * @param res
 * @param next
 */
function decodeToken(req, res, next) {
  const token = req.headers['x-access-token'] || req.cookies.token;
  if (!token) {
    logger.debug(MESSAGES.MISSING_TOKEN);
    return res.status(403).send(MESSAGES.MISSING_TOKEN);
  }
  const decodedToken = encryption.verifyToken(token);
  if (decodedToken.err) {
    logger.debug(MESSAGES.AUTHENTICATION_FAILED, decodedToken.err);
    return res.status(403).send(MESSAGES.AUTHENTICATION_FAILED);
  }
  // auth success
  req.authenticatedUser = decodedToken;
  return next();
}

/**
 * @param req
 * @param res
 * @param next
 */
async function loadUserFromToken(req, res, next) {
  const { userController } = require('../components/user');
  // Fetch the user from decodedToken token
  const user = await userController.getById(req.authenticatedUser._id);
  // we can extend this and fetch user from db to get his current data
  if (user) {
    req.user = user.toObject();
    next();
  } else {
    logger.warn(
      `loadUserFromToken${MESSAGES.UNAUTHORIZED_ATTEMPT(
        req.originalUrl,
        req.authenticatedUser.email,
        req.authenticatedUser._id
      )}`
    );
    return res.status(403).send(MESSAGES.UNAUTHORIZED);
  }
}

/**
 * @param req
 * @param res
 * @param next
 */
function andRestrictToSelf(req, res, next) {
  // If our authenticated user is the user we are viewing
  // then everything is fine :)
  if (req.authenticatedUser._id === req.user._id) {
    next();
  } else {
    // You may want to implement specific exceptions
    // such as UnauthorizedError or similar so that you
    // can handle these can be special-cased in an error handler
    // (view ./examples/pages for this)
    logger.warn(
      `andRestrictToSelf${MESSAGES.UNAUTHORIZED_ATTEMPT(
        req.originalUrl,
        req.authenticatedUser.email,
        req.authenticatedUser._id
      )}`
    );
    return res.status(403).send(MESSAGES.UNAUTHORIZED);
  }
}

/**
 * @param typeArr
 */
function andRestrictTo(typeArr = []) {
  if (typeof typeArr === 'string') typeArr[0] = typeArr;
  return (req, res, next) => {
    if (!typeArr.includes(req.user.type)) {
      logger.warn(
        `andRestrictTo${MESSAGES.UNAUTHORIZED_ATTEMPT(
          req.originalUrl,
          req.authenticatedUser.email,
          req.authenticatedUser._id
        )}`
      );
      return res.status(403).send(MESSAGES.UNAUTHORIZED);
    }
    return next();
  };
}

// * this illustrates how an authenticated user
// * may interact with middleware

// app.use(function(req, res, next) {
// 	req.authenticatedUser = users[0];
// 	next();
// });

// app.get('/', function(req, res) {
// 	res.redirect('/user/0');
// });

// app.get('/user/:id', loadUser, function(req, res) {
// 	res.send('Viewing user ' + req.user.name);
// });

// app.get('/user/:id/edit', loadUser, andRestrictToSelf, function(req, res) {
// 	res.send('Editing user ' + req.user.name);
// });

// app.delete('/user/:id', loadUser, andRestrictTo('admin'), function(req, res) {
// 	res.send('Deleted user ' + req.user.name);
// });

module.exports = {
  decodeToken,
  loadUserFromToken,
  andRestrictToSelf,
  andRestrictTo
};
