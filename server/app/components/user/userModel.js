const { errorHandle } = require('../../util');
const { baseController } = require('../../controllers');
const { userSchema } = require('.');

class User extends baseController {
	constructor() {
		super(userSchema);
	}

	async insert(user) {
		return this.create(user);
	}

	async getUserByEmail(email, options = {}) {
		try {
			return this.findOne({ email: email }, options);
		} catch (error) {
			errorHandle.handle('failed getUserByEmail', error, 'UserModel');
		}
	}

	async getAllUsers() {
		try {
			return this.getAll();
		} catch (error) {
			errorHandle.handle(`failed getAllUsers`, error, 'UserModel');
		}
	}


	async updateBy(query, data, options = {}) {
		if(!query) throw Error('query not provided');
		try {
			return this.findOneAndUpdate(query, data, options);
		} catch (error){
			errorHandle.handle(`failed updateBy ${query}`, error, 'UserModel');
		}
	}

	async updateById(query) {
		if(!query) throw Error('query not provided');
		try {
			return this.findOneByIdAndUpdate(query);
		} catch (error) {
			errorHandle.Handle(`failed to getUserByEmail ${query}`,error);
		}
	}

}

module.exports = new User();
