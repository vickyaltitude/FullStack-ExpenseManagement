const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const cors = require('cors');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 6969;
require('dotenv').config();

const signup = require('./routes/signup')
const home = require('./routes/Home');
const newuser = require('./routes/newuser');
const login = require('./routes/login');
const expenses = require('./routes/expenses');
const crud = require('./routes/crud.JS');
const premium = require('./routes/premium');
const forgotpassword = require('./routes/forgotpassword');
const resetpassword = require('./routes/resetpassword');

const morgan = require('morgan');


const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags: 'a'})
app.use(morgan('combined',{stream: accessLogStream}))
app.use(cors({
    origin: 'http://localhost:6969',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


app.get('/', (req, res) => {
    res.redirect('/signup');
});

app.use('/signup',signup)

app.use('/home',home);

app.use('/insertuser',newuser)


app.use('/login',login)

app.use('/expenses',expenses)

app.use('/items',crud)

app.use('/premium',premium)


app.use('/forgotpassword',forgotpassword)


app.use('/resetpassword',resetpassword)








app.listen(PORT,()=> console.log(`server is successfully running on port ${PORT}`))