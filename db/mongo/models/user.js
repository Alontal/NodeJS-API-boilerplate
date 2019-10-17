const mongoose = require('mongoose');
const { hash, genSalt, compare } = require('bcrypt-nodejs')
const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
            lowercase: true,
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
        },
    },
	{
		timestamps: true
	}
);


/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }
    genSalt(10, (err, salt) => {
      if (err) { return next(err); }
      hash(user.password, salt, (err, hash) => {
        if (err) { return next(err); }
        user.password = hash;
        next();
      });
    });
  });
  
  /**
   * Helper method for validating user's password.
   */
  userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch);
    });
  };



module.exports = mongoose.model('user', userSchema);
