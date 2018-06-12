var uuidV4 = require('uuid/v4'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt-nodejs'),
    E = module.exports;


// generate random id for this user
E.generateUserId = () => {
    return uuidV4();
};

// Hash and salt the password with bcrypt
E.hashPassword = (password) => {
    return bcrypt.hashSync(password + process.env.SECRET, bcrypt.genSaltSync(8), null);
};

// Check if password is valid
E.validPassword = (password, savedPassword) => {
    return bcrypt.compareSync(password + process.env.SECRET, savedPassword);
};
// Create new token
E.createToken = (user) => {
    return jwt.sign(_.omit(user, 'password'), process.env.SECRET, { expiresIn: 60 * 60 * 5 });
}