const express = require('express');
const db = require('../db');
const util = require('../util');
const router = express.Router();
//const router=require('../router')

router.post('/',(request,response)=>{
    const{
        CategoryId,
        title,
        details,
        address,
        contactNo,
        ownerName,
        isLakeview,
        isTv,
        isAC,
        isWifi,
        isMiniBar,
        isBreakFast,
        isParking,
       guests,
       bedrooms,
       bed,
       bathrooms,
       rent,
    }=request.body;

    const query = `insert into property (category_id,title,details,address,contactNo,ownerName,isLakeView,isTV,isAC,isWifi,isMiniBar,isBreakFast,isParking,guests,bedrooms,bed,bathrooms,rent) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.pool.execute(query,[CategoryId,title,details,address,contactNo,ownerName,isLakeview,isTv,isAC,isWifi,isMiniBar,isBreakFast,isParking,guests,bedrooms,bed,bathrooms,rent],
        (error,result)=>{
            response.send(util.createResult(error,result))
    })
})

router.get('/',(request,response)=>{
    const statement = `select id,title,details,rent,profileImage from property`;
    db.pool.query(statement,(error,properties)=>{
          response.send(util.createResult(error,properties))
    })
})

router.get('/details/:id',(request,response)=>{
    const {id} = request.params
    const statement=`select * from property where id=?`;
    db.pool.query(statement,[id],(error,property)=>{
        response.send(util.createResult(error,properties[0]))
    })
})

module.exports = router