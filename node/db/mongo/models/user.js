const mongoose = require('mongoose');
const { hash, genSalt, compare } = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      lowercase: true
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true
    },
    type: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);


/**
 * Password hash middleware.
 */
userSchema.pre('save', (next) => {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  return genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    return hash(user.password, salt, (error, res) => {
      if (error) { return next(error); }
      user.password = res;
      return next();
    });
  });
});

/**
 * Helper method for validating user's password.
 *
 * @param candidatePassword
 * @param cb
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};


module.exports = mongoose.model('user', userSchema);
