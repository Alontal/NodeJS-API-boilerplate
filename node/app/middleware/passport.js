const { logger, encryption } = require('../app/util');
const LocalStrategy = require('passport-local').Strategy;
const { userService } = require('../app/components/user');

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, { email: user.email, id: user.id, token: user.token });
  });

  passport.deserializeUser(async ({ email }, done) => {
    try {
      const user = await userService.findByOneByEmail(email);
      if (!user) {
        return done(new Error('user not found'));
      }
      done(null, user);
    } catch (e) {
      done(e);
    }
  });

  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        let user;
        try {
          user = await userService.findByOneByEmail(email);
          if (!user) {
            return done(null, false);
          }
        } catch (e) {
          logger.error('something happened in local strategy on passport auth');
          return done(e);
        }

        const match = await encryption.validPassword(password, user.password);
        if (!match) {
          return done(null, false, {
            message: 'Password not match'
          });
        }
        user.token = encryption.createToken({
          email: user.email,
          id: user.id
        });

        return done(null, user);
      }
    )
  );
};
