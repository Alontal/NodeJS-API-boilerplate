var logger = require('../../app/util/logger'),
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
let pool = mysql.createPool(config);
pool.getSqlConnection = () => {
    return pool.getConnection().disposer(function (connection) {
        pool.releaseConnection(connection);
    });
}

E.get = () => {
    return pool
}

// array of pools. store pools to use multi databases
E.pools = [];

E.addNewPool = (name, config) => {
    try {
        let pool = mysql.createPool(config);
        pool.getSqlConnection = () => {
            return pool.getConnection().disposer(function (connection) {
                pool.releaseConnection(connection);
            });
        }
        pool.executeSql = E.executeSql;
        E.pools[name] = pool;

    } catch (error) {
        logger.error('addNewPool', error)
    }
}

E.executeSql = {
    query: async (query, params, database = E.get()) => {
        try {
            let res = await database.query(query, params);
            if (res.length === 0) logger.debug(`"${query} ${params}" return no results`,res);
            return res;
        } catch (error) {
            logger.error('mysql: ', {
                sql: error.sql,
                message: error.message,
                sqlMessage: error.sqlMessage,
                stack: error.stack
            });
            return error;
        }
    },
    insertIntoTable: async (tableName, array) =>
        E.executeSql.query('INSERT INTO ' + tableName + ' SET ? ;', array)
    ,
    getTableByName: (tableName) => {
        E.executeSql.query('SELECT * FROM ' + tableName)
    },
    updateTable: (table, obj, where_key, where_value ) => E.executeSql.query('UPDATE ? SET ?  WHERE ? = ? ', [table, obj, where_key, where_value ])
}

// E.executeSql = ((pool) => {
//     return {
//         query: async (query, params) => {
//             try {
//                 let res = await pool.query(query, params);
//                 if (res.length === 0) throw Error(res);
//                 return res;
//             } catch (error) {
//                 logger.error('mysql: ', {
//                     sql: error.sql,
//                     message: error.message,
//                     sqlMessage: error.sqlMessage,
//                     stack: error.stack
//                  });
//                 return null;
//             }
//         },
//         insertIntoTable: async (tableName, array) =>
//             E.executeSql.query('INSERT INTO ' + tableName + ' SET ? ;', array)
//         ,
//         getTableByName: (tableName) => {
//             E.executeSql.query('SELECT * FROM ' + tableName)
//         }

//     };

// })();
// E.executeSql(E.get());
