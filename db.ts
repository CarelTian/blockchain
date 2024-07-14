const mysql = require('mysql2');
require('dotenv').config({ path: './db.env' });

function creatDB(){
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,   
        user: process.env.DB_USER, 
        password:process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
    connection.connect(error => {
        if (error) {
          console.error('connect database error: ', error);
          return;
        }
      });
    return connection
}

function closeDB(connection){
    connection.end(error => {
        if (error) {
          console.error('关闭连接失败: ', error);
          return;
        }
      });
      
}
module.exports ={creatDB,closeDB} ;
