const { RestApi } = require('../../controllers/index')
const BaseControllerSql = require('../../controllers/baseControllerSql')
const UserModel = require('../../../db/sequelize/models/index').user

const UserApi = new RestApi('user',new BaseControllerSql(UserModel))

module.exports = UserApi.router

