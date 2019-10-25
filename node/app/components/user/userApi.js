const { RestApi } = require("../../controllers/index");
const { baseModelSQL } = require("../../models");
const UserModel = require("../../../db/sequelize/models/index").user;

const UserApi = new RestApi("user", new baseModelSQL(UserModel));

module.exports = UserApi.router;
