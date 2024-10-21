const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ds = require('../util/data');
require('dotenv').config();

router.get('/', (req, res) => {
    const receivedhead = req.header("Authorization");
    if (!receivedhead) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    const token = receivedhead.split(' ')[1];
    let user;

    try {
        user = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }

    if (!user || !user.userId) {
        return res.status(401).json({ message: 'User not found.' });
    }

    ds.execute(`SELECT expense_details.id AS id, amount, description, category, user_id, created_date, name
    FROM expense_details
    INNER JOIN users ON expense_details.user_id = users.id
    WHERE users.id = ?;`, [user.userId]).then(resp => {
        let datas = resp[0];
        res.json({ datas });
    }).catch(err => {
        console.error(err); 
        res.status(500).json({ message: 'Database error occurred.' });
    });
});

module.exports = router;
