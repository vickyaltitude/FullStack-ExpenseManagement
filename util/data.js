
const mysql2 = require('mysql2');
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.USER_DB,
    database: process.env.USER_DB_DATABASE,
    password: process.env.USER_DB_PASSWORD
})

module.exports = pool.promise();