const logger = require('../util/logger');

class BaseControllerSql {
	constructor(model) {
		this.model = model;
	}

	async insert(data) {
		try {
            const created = await this.model.create(data)
			if (created.err) throw created.err;
			return created;
		} catch (error) {
			logger.error(`BaseSql class, function: insert ,error: ${error}`);
			return false;
		}
	}

	async getOne(query) {
		try {
			let doc = await this.model.findOne({ where:{ query } });
			return doc;
		} catch (error) {
			logger.error(`BaseSql class, function: getOne ,error: ${error}`);
			return false;
		}
	}

	async getMany(query = {}) {
		try {
			let docs = await this.model.findAll({ where: query });
			return docs;
		} catch (error) {
			logger.error(`BaseSql class, function: getMany ,error: ${error}`);
			return false;
		}
	}

	async update(newData, query = {}) {
		try {
			await this.model.update(newData,{where: query})
			return true;
		} catch (error) {
			logger.error(`BaseSql class, function: update ,error: ${error}`);
			return false;
		}
	}

	async delete(query) {
		try {
			await this.model.destroy({ where: query });
			return true;
		} catch (error) {
			logger.error(`BaseSql class, function: delete ,error: ${error}`);
			return false;
		}
	}
}

module.exports = BaseControllerSql;