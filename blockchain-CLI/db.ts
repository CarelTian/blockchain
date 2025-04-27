/**
 * @fileoverview Description of the file's purpose
 * @author Reynor Lou
 * @version 1.1.0
 * @date 2024-7-18
 */

const mysql = require('mysql2');
require('dotenv').config({ path: './config.env' });
function connectDB(){
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,   
        user: process.env.DB_USER, 
        password:process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
    connection.connect(error => {
        if (error) {
          console.error('Connect database error: ', error);
          return;
        }
      });
    return connection
}

function closeDB(connection){
    connection.end(error => {
        if (error) {
          console.error('Disconneted failed: ', error);
          return;
        }
      });
      
}
module.exports ={connectDB,closeDB} ;
