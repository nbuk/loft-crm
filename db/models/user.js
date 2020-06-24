'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    surName: DataTypes.STRING,
    username: DataTypes.STRING,
    image: DataTypes.STRING,
    password: DataTypes.STRING,
    permission: {
      type: DataTypes.JSON
    }
  }, {});
  user.associate = function(models) {
    // user.hasMany(models.news, {
    //   foreignKey: 'userID'
    // })
  };
  return user;
};