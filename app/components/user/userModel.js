const { baseController } = require('../../controllers');
const { userSchema } = require('.');

//if you want to add functions that will interact with the datbase
//do it here, we recommand getting logic out to the controller
//all the CRUD already implemented on the BaseContrller

module.exports = new baseController(userSchema);
