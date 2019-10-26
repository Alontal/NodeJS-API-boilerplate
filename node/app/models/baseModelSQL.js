const { responseHandler } = require('../util');

class baseModelSQL {
  constructor(model) {
    this.model = model;
  }

  async insert(data, options) {
    try {
      const created = await this.model.create(data, options);
      if (created.err) throw created;
      return responseHandler('insert', true, { data: created });
    } catch (error) {
      return responseHandler('insert', false, { error });
    }
  }

  async getOne(query, options) {
    try {
      const item = await this.model.findOne(query, options);
      return responseHandler('getOne', true, { data: item });
    } catch (error) {
      return responseHandler('getOne', false, { error });
    }
  }

  async getMany(query, options) {
    try {
      const docs = await this.model.findAll(query || {}, options);
      return responseHandler('getMany', true, { data: docs });
    } catch (error) {
      return responseHandler('getMany', false, { error });
    }
  }

  async update(newData, options) {
    try {
      const updated = await this.model.update(newData, options);
      return responseHandler('update', true, { data: updated });
    } catch (error) {
      return responseHandler('update', false, { error });
    }
  }

  async delete(where) {
    try {
      const deleted = await this.model.destroy(where);
      return responseHandler('delete', true, { data: deleted });
    } catch (error) {
      return responseHandler('delete', false, { error });
    }
  }

  async createOrUpdate(newItem, where, association) {
    try {
      const foundItem = await this.model.findOne({ where });
      if (!foundItem) {
        let item;
        if (association) {
          item = await this.model.create(newItem, association);
        } else item = await this.model.create(newItem);
        return responseHandler('inserted', true, { data: { item, created: true } });
      }
      const updated = await this.model.update(newItem, { where });
      return responseHandler('createOrUpdate', true, { data: { updated, item: foundItem } });
    } catch (error) {
      return responseHandler('createOrUpdate', false, { error });
    }
  }
}

module.exports = baseModelSQL;
