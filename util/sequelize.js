const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.USER_DB_DATABASE,process.env.USER_DB,process.env.USER_DB_PASSWORD,{
    dialect: 'mysql',
    host: process.env.DB_HOST
})

module.exports = sequelize;