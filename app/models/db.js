const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
// const connection = mysql.createConnection({
//   host: dbConfig.HOST,
//   user: dbConfig.USER,
//   password: dbConfig.PASSWORD,
//   database: dbConfig.DB
// });

const connection = mysql.createConnection(dbConfig.DB_URL)

// open the MySQL connection
connection.connect(error => {
  if (error) {
    console.log(error);
  } else {
    console.log("Successfully connected to the database.");
  }
});

module.exports = connection;
