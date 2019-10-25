const { RestApi } = require('../../controllers/index');
const { BaseModel } = require('../../models');
const UserModel = require('../../../db/sequelize/models/index').user;

const UserApi = new RestApi('user', new BaseModel(UserModel));

module.exports = UserApi.router;
