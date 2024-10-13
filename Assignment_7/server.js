//server setup
//import exprees for server
const express=require('express');
//call

const util=require('./util.js');
const jwt=require('jsonwebtoken');
const config=require('./config.js');
//express library required to create server
const app=express();

const userrouter=require("./route/user.js");
const propertyrouter=require("./route/property.js");
const categoryrouter=require("./route/category.js");
const bookingrouter=require("./route/booking.js");

//server assign
app.use(express.json()); 
//middleware to verify the token
app.use((request,response,next)=>{
    if(
        request.url === '/user/login' ||
        request.url === '/user/register'||
        request.url === '/user/profile/:id'||
        request.url.startsWith('/image')
        
    )
    {
        next()
    }else{
        const token = request.headers['token']

        if(!token || token.length === 0){
            response.send(util.createErrorResult('missing token'))
        }else{
            try{
                 //verify the token
                 const payload =jwt.verify(token, config.secret)
                 request.userId = payload['id']
                 next()
            }
            catch(ex){
                 response.send(util.createErrorResult('invalid token'))
            }
        }
    }
})
app.use('/user',userrouter);
app.use('/property',propertyrouter);
app.use('/category',categoryrouter);
app.use('/booking',bookingrouter);

//call



//server running
app.listen(9999,()=>{
    console.log('server is running');
})



