const db = require('../mysql/mysql');

const data_config = {
	host: process.env.DATA_DB_HOST,
	user: process.env.DATA_DB_USER,
	password: process.env.DATA_DB_PASS,
	database: process.env.DATA_DB_DATABASE,
	connectionLimit: process.env.DATA_DB_CONNECTIONLIMIT
};

const db2_config = {
	host: process.env.DB2_DB_HOST,
	user: process.env.DB2_DB_USER,
	password: process.env.DB2_DB_PASS,
	database: process.env.DB2_DB_DATABASE,
	connectionLimit: process.env.DB2_DB_CONNECTIONLIMIT
};
const db3_config = {
	host: process.env.DB3_DB_HOST,
	user: process.env.DB3_DB_USER,
	password: process.env.DB3_DB_PASS,
	database: process.env.DB3_DB_DATABASE,
	connectionLimit: process.env.DB3_DB_CONNECTIONLIMIT
};

db.addNewPool('data', data_config);
db.addNewPool('db3', db3_config);
db.addNewPool('db2', db2_config);