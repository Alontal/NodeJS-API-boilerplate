var logger = require('../util/logger'),
    mysql = require('promise-mysql'),
    E = module.exports;
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTIONLIMIT
}

logger.info('making connection using this db conf:', config);
var pool = mysql.createPool(config);
pool.getSqlConnection = () => {
    return pool.getConnection().disposer(function (connection) {
        pool.releaseConnection(connection);
    });
}

E.get = () => {
    return pool
}

E.getTableByName = (tableName) => {
    return E.get().query('SELECT * FROM ' + tableName)
}
E.insertIntoTable = (tableName, array) => {
    return E.get().query('INSERT INTO ' + tableName + ' SET ?', [array])
}
