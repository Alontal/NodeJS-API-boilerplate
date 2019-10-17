const { RestApi } = require('../../controllers/index')
const UserModel = require('../../../db/mongo/models/user')
const { BaseControllerNoSql } = require('../../controllers/')

const UserApi = new RestApi('user',new BaseControllerNoSql(UserModel))

module.exports = UserApi.router

