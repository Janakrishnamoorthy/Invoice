const mysql = require("mysql");

// Create the MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     
  password: "",  
  database: "invoicedb" 
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Export the connection
module.exports = db;


// const mysql = require("mysql");

// // Create the MySQL connection
// const db = mysql.createConnection({
//   host: "localhost:3001",
//   user: "u195178144_react_invoice",     
//   password: "Jana@2024",  
//   database: "u195178144_invoicedb" 
// });

// // Connect to the database
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     return;
//   }
//   console.log("Connected to MySQL");
// });

// // Export the connection
// module.exports = db;
