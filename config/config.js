// headers to use in development , evil.com-used by CORS extension, undefined used by postman... 
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

const LUSCA_OPTIONS = {
	csrf: process.env.NODE_ENV === 'production' ? true : false,
	csp: {
		policy: {
			'default-src': '\'self\'',
			'img-src': '*'
		  }
	},
	xframe: 'SAMEORIGIN',
	p3p: 'ABCDEF',
	hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
	xssProtection: true,
	nosniff: true,
	referrerPolicy: 'same-origin'
};

module.exports = {
	CORS_WHITE_LIST,
	LUSCA_OPTIONS
};