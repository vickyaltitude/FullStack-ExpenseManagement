const mysql2 = require('mysql2');
const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    database: 'expense_tracker',
    password: 'Welcome@123'
})

module.exports = pool.promise();