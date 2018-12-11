const mongoose = require("mongoose");

const TestModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    status: {
      type: String
    }
  },
  { strict: false } 
);

TestModel.methods.generateAuthToken = function ()  {
    // const token = jwt.sign({_id: this._id},s_Data.private_key, { expiresIn: '30m'});
    return 'token';
}
// let tests_mongo =  mongoose.model("test", TestModel);
module.exports = mongoose.model("test", TestModel);