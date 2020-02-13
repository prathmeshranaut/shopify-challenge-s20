const Sequelize = require('sequelize');

const sequelize = new Sequelize('shopify', 'root', 'aayush', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;