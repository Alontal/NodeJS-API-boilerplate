const logger = require('../util/logger');
const { isEqual } = require('lodash');

class BaseControllerNoSql {
	constructor(model) {
		this.model = model;
	}

	async insert(data) {
		try {
			const newModel = new this.model(data);
			let created = await newModel.save();
			if (created.err) throw created.err;
			return created;
		} catch (error) {
			logger.error('base class', error, 'function name: create');
			return error;
		}
	}

	async getOne(query, options = {}) {
		try {
			let doc = await this.model.findOne(query, options);
			return doc;
		} catch (error) {
			logger.info('base class', error, 'function name: getOne');
			return error;
		}
	}

	async getMany(query = {}, options = {}) {
		try {
			let docs = await this.model.find(query, options);
			return docs;
		} catch (error) {
			logger.info('base class', error, 'function name: getMany');
			return error;
		}
	}

	async update(query, newData, options = { new: true }) {
		try {
			const oldDoc = await this.getOne(query);
			const updated = await this.model.findOneAndUpdate(
				query,
				{ $set: newData },
				options
			);
			if (isEqual(oldDoc, updated)) {
				logger.debug('Failed to update document on database');
				throw updated.err;
			}
			return true;
		} catch (error) {
			logger.info('base class', error, 'function name: update');
			return false;
		}
	}

	async delete(query, options = { rawResult: true }) {
		try {
			const deleted = await this.model.findOneAndDelete(query, options);
			const verifyDelete = await this.model.findOne(query);
			if (!deleted && !verifyDelete) {
				logger.debug('Failed to delete document from database');
				throw deleted.err;
			}
			return true;
		} catch (error) {
			logger.info('base class', error, 'function name: delete');
			return false;
		}
	}
}

module.exports = BaseControllerNoSql;
