const { logger } = require('../../util');
const {isEmpty,isLength,isEmail,matches,isNumeric, is} = require('validator');
const passwordRegex = new RegExp(
	/(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
);
const MESSAGES = {
	FAILED_IN: 'Failed while trying to Validate: ',
};

function validateUserInsert (user){
	let errors=[];
	const email = user.email && !isEmpty(user.email) && isEmail(user.email) && isLength(user.email,{ min: 5, max: 200 }),
		password = user.password && !isEmpty(user.password) && isLength(user.password,{min:8}) && matches(user.password,passwordRegex),
		firstName = user.firstName && !isEmpty(user.firstName) && isLength(user.firstName,{ min: 2, max: 50 }),
		lastName = user.lastName && !isEmpty(user.lastName) && isLength(user.lastName,{ min: 2, max: 50 }),
		type=user.type && isLength(user.type,{ min: 3, max: 10 }),
		company = user.company && isLength(user.company,{ min: 3, max: 10 });

	//required fields
	if(!email){
		errors.push('Email is empty or invalid');
	}

	if(!password){
		errors.push('Password is empty or invalid,'+
		'should be 8 charecteres long with 1 uppercase '+
		'1 number, 1 lowercase, one symbol');
	}

	if(!firstName){
		errors.push('first name is empty or invalid');
	}

	if(!lastName){
		errors.push('last name is empty or invalid');
	}

	if(!type){
		errors.push('type is empty or invalid');
	}

	if(!user.terms){
		errors.push('You have to accept our terms of service in order to register.');
	}

	//non required fields
	if(user.company && !company){
		errors.push('company is empty or invalid');
	}
	
	try {
		return errors;
	} catch (error) {
		logger.error(MESSAGES.FAILED_IN + 'insert');
		return; 
	}
};

function validateUserLogin (user){
	let errors=[];
	const email = user.email && !isEmpty(user.email) && isEmail(user.email) && isLength(user.email,{ min: 5, max: 200 }),
		password = user.password && !isEmpty(user.password) && isLength(user.password,{min:8}) && matches(user.password,passwordRegex);

	//required fields
	if(!email){
		errors.push('Email is empty or invalid');
	}
	
	if(!password){
		errors.push('Password is empty or invalid,'+
			'should be 8 charecteres long with 1 uppercase '+
			'1 number, 1 lowercase, 1 symbol');
	}

	try {
		return errors;
	} catch (error) {
		logger.error(MESSAGES.FAILED_IN + 'Login');
		return; 
	}
}

function validatePasswordReset (newPassword, newPasswordConf){
	let errors=[];
	password = newPassword && !isEmpty(newPassword) && isLength(newPassword,{ min:8 }) && matches(newPassword, passwordRegex);
	passwordConf = newPasswordConf && !isEmpty(newPasswordConf) && matches(newPasswordConf, newPassword);

	if(!password){
		errors.push('Password is empty or invalid,'+
			'should be 8 charecteres long with 1 uppercase '+
			'1 number, 1 lowercase, 1 symbol');
	}
	if(!passwordConf){
		errors.push('Passwords dont match or empty');
	}

	try {
		return errors;
	} catch (error) {
		logger.error(MESSAGES.FAILED_IN + 'password reset');
		return; 
	}
}

module.exports = {
	validateUserInsert,
	validateUserLogin,
	validatePasswordReset
};
