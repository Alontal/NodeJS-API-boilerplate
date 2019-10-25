const { encryption } = require('../../../app/util/');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: async u => {
          user.password = await encryption.hashPassword(u.password);
        }
      }
    }
  );
  user.associate = models => {
    // associations can be defined here
  };
  return user;
};
