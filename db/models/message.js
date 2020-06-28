'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    userId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {});
  message.associate = function(models) {
    message.hasMany(models.user, {
      foreignKey: 'id'
    })
  };
  return message;
};