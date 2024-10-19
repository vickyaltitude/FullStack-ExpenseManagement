const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 6969;

const signup = require('./routes/signup')
const home = require('./routes/Home');
const newuser = require('./routes/newuser');
const login = require('./routes/login');
const expenses = require('./routes/expenses');
const crud = require('./routes/crud.JS');
const premium = require('./routes/premium');
const forgotpassword = require('./routes/forgotpassword');
const resetpassword = require('./routes/resetpassword');
const helmet = require('helmet');
const morgan = require('morgan');


const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags: 'a'})
app.use(morgan('combined',{stream: accessLogStream}))
app.use(helmet());
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