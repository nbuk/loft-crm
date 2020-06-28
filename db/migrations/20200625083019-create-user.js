'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      middleName: {
        type: Sequelize.STRING
      },
      surName: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING,
        unique: true
      },
      image: {
        type: Sequelize.STRING,
        defaultValue: 'assets/img/no-user-image-big.png'
      },
      password: {
        type: Sequelize.STRING
      },
      permission: {
        type: Sequelize.JSON,
        defaultValue: {
          chat: { C: true, R: true, U: true, D: true },
          news: { C: false, R: true, U: false, D: false },
          settings: { C: false, R: false, U: false, D: false },
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};