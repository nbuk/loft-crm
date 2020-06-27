'use strict';
module.exports = (sequelize, DataTypes) => {
  const chat = sequelize.define('chat', {
    userId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {});
  chat.associate = function(models) {
  };
  return chat;
};