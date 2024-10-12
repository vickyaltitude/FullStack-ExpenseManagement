const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 6969;
const ds = require('./util/data');

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','signup.html'))
})

app.post('/insertuser',(req,res)=>{

     const name = req.body.name;
     const email = req.body.email;
     const passwd = req.body.pswd;
     console.log(name,email,passwd)
    
        ds.execute('INSERT INTO `users` (name,email,password) VALUES(?,?,?)',[name,email,passwd]).then(resp =>{
            res.status(200).json({msg: 'user added successfully'})
        }).catch(err => {
            console.log(err) ;
            res.status(404).json({error: err});
        });
    
})

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','login.html'))
})

app.post('/login',(req,res)=>{
    const email = req.body.email;
    const passwrd = req.body.pswd;
    console.log(email,passwrd);
    ds.execute('SELECT * FROM users WHERE email = ?',[email]).then(resp =>{

        const datafetched = resp[0];

        if(datafetched.length == 0){
            res.status(404).json({msg: 'User Email not found!'})
        }else {
            if(datafetched[0].password != passwrd.toString()){
                res.status(401).json({msg: 'Password entered is incorrect!'})
            }
            else if (datafetched[0].password == passwrd.toString()){
                res.json({msg: 'User login successfull'})
            }
        }
    }).catch(err => console.log(err));
   
})

app.listen(PORT,()=> console.log(`server is successfully running on port ${PORT}`))