const Sequelize = require('sequelize');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, 'config.js'))[env];

const sequelize = new Sequelize(`postgres://${config.host}:5432/${config.database}`, config);

module.exports = sequelize;