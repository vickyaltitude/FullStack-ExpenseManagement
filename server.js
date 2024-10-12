const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 6969;
const ds = require('./util/data');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','signup.html'))
})

app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','expensespage.html'))
})

app.post('/insertuser',(req,res)=>{

     const name = req.body.name;
     const email = req.body.email;
     const passwd = req.body.pswd;

     bcrypt.hash(passwd,10, (err,hash)=>{
        if(err){
            console.log(err)
        }
        else{
           ds.execute('INSERT INTO `users` (name,email,password) VALUES(?,?,?)',[name,email,hash]).then(resp =>{
                res.status(200).json({msg: 'user added successfully'})
            }).catch(err => {
                console.log(err) ;
                res.status(404).json({msg: 'User already exist'});
            });
    
        }

     })
    
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

            bcrypt.compare(passwrd.toString(),datafetched[0].password,(err,result)=>{

                if(err){
                    res.status(500).json({msg: 'Something went wrong!!'})
                }
                if(result == true){
                    res.json({msg: 'User login successfull'})
                }
                else{
                    res.status(401).json({msg: 'Password entered is incorrect!'})
                }
            })
           
        }
    }).catch(err => console.log(err));
   
})

app.listen(PORT,()=> console.log(`server is successfully running on port ${PORT}`))