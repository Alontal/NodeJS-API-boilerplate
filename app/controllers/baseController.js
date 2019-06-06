const {logger} = require('../util');

class BaseController {

	constructor(model) {
		this.model = model;
	}

	async create(data, options) {
		logger.debug('BaseController create');
		let res =  await this.model.create(data, options);
		if(res.errors) logger.error('BaseController create', res.errors);
		else logger.info(`doc ${res.id} inserted `);       
		return res;
	}

	async getAll( select = '-__v', populate = '') {
		return this.model.find({}).select(select).populate(populate);
	}
	async selectOne( select = '-__v', populate = '') {
		return this.model.find({}).select(select).populate(populate);
	}

	async selectSingle(id, select = '-__v', populate = '') {
		return this.model.findById(id).select(select).populate(populate);
	}

	async find(query, options){
		return this.model.find(query, options);
	}
	
	async findOne(query, options){
		return this.model.findOne(query, options);
	}
	
	async findOneAndUpdate(query, data, options){
		return this.model.findOneAndUpdate(query, data, options);
	}

	// async findOneByIdAndUpdate(id, data) {
	// 	return await this.model.findByIdAndUpdate(id, data);
	// }
	
	async removeOne(id) {
		return this.model.findByIdAndRemove(id);
	}


}
module.exports = BaseController;