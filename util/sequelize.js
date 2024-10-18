const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense_tracker','root','Welcome@123',{
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;