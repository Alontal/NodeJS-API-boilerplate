const fs = require('fs'),
        logger = require('../util/logger');

class BaseController {

    constructor(model) {
        this.model = model;
    }

    async create(data) {
        logger.debug('BaseController create');
        let res =  await this.model.create(data);
        if(res.errors) logger.error('BaseController create', res.errors);
        else logger.info(`doc ${res.id} inserted `);       

        return res;

        
    }

    async getAll( select = "-__v", populate = "") {
        return this.model.find({}).select(select).populate(populate);
    }

    async getSingle(id, select = "-__v", populate = "") {
    }

    async removeOne(id) {
        return this.model.findByIdAndRemove(id);
    }
    
    async edit(id, data) {
        return await this.model.findByIdAndUpdate(id, data)
        // return
    }
}

let modelPath = (model_name) => `../../models/${model_name}/${model_name}Model`;

let get_module = (model_name)=>{
    let _module;
    try {
        let module_path = modelPath(model_name)
        _module = require(module_path);
    } catch (error) {
        logger.error('wrong model path loaded to base ctrl')
        return;
    }
    return  _module
};

module.exports = (model_name) => new class New extends BaseController{
    constructor(){
        super(get_module(model_name));
    }
}