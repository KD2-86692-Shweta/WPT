//router is used to handle navigation from file to file  ,used to manage server request
const express=require('express');

//connect database
const db=require("../db.js");
const crypto=require('crypto-js');
const jwt=require('jsonwebtoken');
const config=require('../config.js');
//handle error and success result

const util=require('../util.js');


//send to server throung routing A router (express.Router()) is created to manage the /login endpoint
const router=express.Router();

router.put('/profile/',(req,res)=>{
    const {firstName, lastName,phoneNumber} = req.body
    const statement= `update user set firstName=?,lastName=?,phoneNumber=? where id=?;`

    db.pool.execute(
        statement,
        [firstName, lastName, phoneNumber, req.userId],
        (error, result)=>{
            res.send(util.createResult(error,result))
        }
    )
})



router.get('/profile/',(req,res)=>{
    const statement=`select firstName,lastName,phoneNumber,email from user where  id= ?`
    db.pool.execute(statement,[req.userId],(error,result)=>{
        res.send(util.createResult(error,result))
    })
})

router.post('/login',(req,res)=>{
   const{email,password}=req.body;

   const stmt=`select id,firstname,lastName,phoneNumber,isDeleted from user where email=? and password=?`;

   const encryptedPassword=String(crypto.SHA256(password))
   db.pool.query(stmt,[email,encryptedPassword],(err,users)=>{
       if(err){
          res.send( util.createErrorResult(err));
       }
       else{
        if(users.length==0){
            res.send(util.createErrorResult('user does not exist'));
        }else{
            const user=users[0]
            if(user.isDeleted){
                res.send(util.createErrorResult('Your account is closed'));
            }else{
                const payload={id: user.id}
                const token = jwt.sign(payload,config.secret)
                const userData = {
                    token,
                    name: `${user['firstName']} ${user['lastName']}`,
                }
                res.send(util.createSuccessResult(userData));
            }
        }
          
       }
   })

})

router.post('/register',(req,res)=>{
    const{ firstName,lastname,email,password,phoneNumber}=req.body;
    const statement=`insert into user(firstname,lastname,email,password,phoneNumber) values(?,?,?,?,?)`;
 //   const encryptedPassword = String(crypto.SHA256(password))
     const encryptedPassword=String(crypto.SHA256(password))

    db.pool.execute(
        statement,
       [firstName,lastname,email,encryptedPassword,phoneNumber],
        (error,result)=>{
            res.send(util.createResult(error,result));
        }
    )
})

router.get('/profile/:id',(req,res)=>{
    const {id} = req.params
    const statement = `select * from user where id = ?`
    db.pool.execute(statement, [id],(error,properties)=>{
        res.send(util.createResult(error,properties[0]))
    })
})

module.exports=router;

