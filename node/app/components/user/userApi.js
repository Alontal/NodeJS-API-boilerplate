const { RestApiController } = require('../../controllers');
const { BaseModelSQL } = require('../../models');
const { user } = require('../../../db/sequelize/models');

const UserApi = new RestApiController('user', new BaseModelSQL(user));

module.exports = UserApi.router;
