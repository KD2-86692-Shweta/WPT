const mysql = require('mysql2');


const pool=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"manager",
    database:"airbnb_db",
    port:3306

   
});

module.exports={pool};

