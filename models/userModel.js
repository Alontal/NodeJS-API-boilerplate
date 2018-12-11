var db = require('../db/mysql/mysql'),
  encrypt = require('../app/util/encryption'),
  logger = require('../app/util/logger'),
  _e = require('../app/util/errorHandle');

var E = module.exports;

E.getUserByEmail = (email) => {
  return db.executeSql.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    .then((rows) => {
      // logger.debug('found... :', { rows });
      return (rows);
    }).catch(error => _e.HandleError('E.getUserByEmail()', error))
}

E.getUserByEmail = async (id) => {
  try {
    return db.executeSql.query('SELECT * FROM users WHERE email = ? LIMIT 1',[id]);
  } catch (error) {
    logger.info(`failed to get user id ${id}`)
    return null;
  }
}

function get(key, value){
  return db.executeSql.query(`SELECT * FROM users WHERE ${key}= ? LIMIT 1`,[ value]);
}

E.getByEmail = (email)=> get('email', email);
E.getById = (id)=> get('id', id);

// E.getById = (id)=> db.executeSql.query('SELECT * FROM users WHERE id = ? LIMIT 1',[ id]);

E.getAllUsers = () => {
  return db.executeSql.getTableByName('users')
    .then((rows) => {
      // logger.debug('found... :', { rows });
      return (rows);
    }).catch(error => _e.HandleError('E.updateUser()', error))
}

E.updateUser = (email, user) => {
  user.time_updated = Date.now();
  return db.executeSql.query('UPDATE users  SET ? WHERE email=? ', [user, email])
    .then((rows) => {
      logger.info('users updated... ', { rows });
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
      if (res.length === 0) {
        user.iid = encrypt.generateUserId();
        user.password = encrypt.hashPassword(user.password);
        user.role = 'Registered';
        user.time_created = Date.now();
      } if (res.length === 1) {
        return ({ message: 'user exist', token: null });
      } else if (!res) {
        return ({ message: 'something went wrong' })
      }

      return db.executeSql.insertIntoTable('users ', user)
        .then((rows) => {
          if (rows.length === 0) return (({ message: 'no rows affected', token: null }))
          logger.debug('new signup:', { rows });
          return E.login(user.email, userOldPass);
        }).catch(error => _e.HandleError('INSERT INTO users', error))
    })
    .catch(error => _e.HandleError('E.insertUser()', error))
}

E.login = (email, password) => {
  if (!email || !password) {
    return Promise.reject('You must send the username and the password');
  }
  return E.getUserByEmail(email).then((rows) => {
    if (rows.length === 0) {
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
