const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.USER_DB_DATABASE,process.env.USER_DB,process.env.USER_DB_PASSWORD,{
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;