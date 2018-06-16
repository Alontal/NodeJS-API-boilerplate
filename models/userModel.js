var db = require('../db/mysql'),
  encrypt = require('../util/encryption'),
  logger = require('../util/logger'),
  _e = require('../util/errorHandle');

var E = module.exports;

E.getUserByEmail = (email) => {
  return db.get().query('SELECT * FROM sys_users WHERE email = ? LIMIT 1', [email])
    .then((rows) => {
      // logger.debug('found... :', { rows });
      return (rows);
    }).catch(error => _e.HandleError('E.getUserByEmail()', error))
}

E.getAllUsers = () => {
  return db.getTableByName('sys_users')
    .then((rows) => {
      // logger.debug('found... :', { rows });
      return (rows);
    }).catch(error => _e.HandleError('E.updateUser()', error))
}

E.updateUser = (email, user) => {
  user.time_updated = Date.now();
  return db.get().query('UPDATE sys_users  SET ? WHERE email=? ', [user, email])
    .then((rows) => {
      logger.info('sys_users updated... ', { rows });
      return (rows.affectedRows);
    }).catch(error => _e.HandleError('E.updateUser()', error))
}

E.insertUser = (user) => {
  var userOldPass = user.password;
  if (!user.email || !user.password) {
    return Promise.reject('You must send the username and the password');
  }
  //check if user exist 
  return E.getUserByEmail(user.email)
    .then((res) => {
      if (res.length == 0) {
        user.iid = encrypt.generateUserId();
        user.password = encrypt.hashPassword(user.password);
        user.role = 'Registered';
        user.time_created = Date.now();
      } if (res.length == 1) {
        return Promise.reject({ message: 'user exist', token: null });
      } else if (!res) {
        return Promise.reject({ message: 'something went wrong' })
      }

      return db.insertIntoTable('sys_users ', user)
        .then((rows) => {
          if (rows.length == 0) return Promise.reject(({ message: 'no rows affected', token: null }))
          logger.debug('new signup:', { rows });
          return E.login(user.email, userOldPass);
        }).catch(error => _e.HandleError('INSERT INTO sys_users', error))
    })
    .catch(error => _e.HandleError('E.insertUser()', error))
}

E.login = (email, password) => {
  if (!email || !password) {
    return Promise.reject('You must send the username and the password');
  }
  return E.getUserByEmail(email).then((rows) => {
    if (rows.length == 0) {
      logger.debug('authentication failed login no such user')
      return Promise.reject({ authentication: 'failed' });
    }
    if (!encrypt.validPassword(password, rows[0].password)) {
      logger.debug('authentication failed login pass dont match username ')
      return Promise.reject({ authentication: 'failed' });
    }
    return ({ message: 'token created', token: encrypt.createToken(rows[0]) })
  })
    .catch(error => {
      if (error.authentication) {
        logger.data(`failed login detected by ${email}`);
        return
      }
      _e.HandleError('E.login() ', error)
    }
    )

}
