const LOCAL_WHITELIST = [
	'http://localhost:3000',
	'http://localhost:3001',
	'http://evil.com/', // for chrome extension no-cors
	undefined, // for postman
	'http://localhost:4200',
	'http://localhost:3001',
	'http://localhost:3002',
];
const PRODUCTION_WHITELIST = [
	process.env.APP_DOMIN,
];

const CORS_WHITE_LIST = process.env.NODE_ENV === 'production' ? PRODUCTION_WHITELIST : LOCAL_WHITELIST;

// above is for normal dev use , evil.com-used by CORS extension, undefined used by postman... 

module.exports = {
	CORS_WHITE_LIST,
};