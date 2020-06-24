const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, 'config.js'))[env];
const models = {};
const modelsFolderPath = './models';

const sequelize = new Sequelize(
    `postgres://${config.host}:5432/${config.database}`,
    config,
);

fs.readdirSync(path.join(__dirname, modelsFolderPath)).forEach((file) => {
    const model = sequelize['import'](
        path.join(__dirname, modelsFolderPath, file),
    );
    models[model.name] = model;
});

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

sequelize.models = models;

module.exports = sequelize;
