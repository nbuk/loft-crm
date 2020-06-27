'use strict';
module.exports = (sequelize, DataTypes) => {
  const news = sequelize.define('news', {
    created_at: DataTypes.DATEONLY,
    text: DataTypes.STRING,
    title: DataTypes.STRING,
    userID: DataTypes.INTEGER
  }, {});
  news.associate = function(models) {
    news.belongsTo(models.user, {
      foreignKey: 'userID'
    })
  };
  return news;
};