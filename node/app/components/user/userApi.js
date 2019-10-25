const { RestApiController } = require('../../controllers');
const { BaseModelSQL } = require('../../models');
const UserModel = require('../../../db/sequelize/models/index').user;

const UserApi = new RestApiController('user', new BaseModelSQL(UserModel));

module.exports = UserApi.router;
