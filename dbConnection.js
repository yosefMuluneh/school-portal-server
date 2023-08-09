const dotenv = require("dotenv");
const mysql = require("mysql")
dotenv.config()
const Mysql_URL = process.env.MYSQL_URL
const USER = process.env.MYSQL_USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE

const connection = mysql.createConnection({
    host: Mysql_URL,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    multipleStatements:true
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      return;
    }
  
    console.log('Connected to database with ID ' + connection.threadId);
  });

  

  module.exports = connection;