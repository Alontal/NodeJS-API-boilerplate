const uuidV4 = require('uuid/v4');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * @description Generate random id for this user.
 */
function generateUserId() {
  return uuidV4();
}

/**
 * @description Hash and salt the password with bcrypt.
 * @param password - Password to hash.
 */
function hashPassword(password) {
  return bcrypt.hash(password + process.env.SECRET, bcrypt.genSaltSync(8));
}

/**
 * @description Check if password is valid.
 * @param password - Input password to validate.
 * @param savedPassword - Check against the saved password.
 */
function validPassword(password, savedPassword) {
  return bcrypt.compare(password + process.env.SECRET, savedPassword);
}

/**
 * @description Create new token.
 * @param data
 * @param expiresIn
 * @expiration time for token to get expired
 * expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d"
 */
function createToken(data, expiresIn = '1d') {
  return jwt.sign(data, process.env.SECRET, { expiresIn });
}

/**
 * @param token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return { err: error };
  }
}

module.exports = {
  generateUserId,
  hashPassword,
  validPassword,
  createToken,
  verifyToken
};
