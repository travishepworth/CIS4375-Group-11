const mysql = require('mysql2');
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'test-database.ceti305yyydb.us-east-1.rds.amazonaws.com',      // e.g., localhost or AWS RDS endpoint
  user: 'admin',           // e.g., root
  password: dbPassword,       // your database password
  database: 'technological_constructions'   // the name of your database
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Example query (optional)
// connection.query('SELECT * FROM Country;', (err, results, fields) => {
//   console.log('Query initiated...');
//   if (err) {
//     console.error('Error executing query:', err);
//     return;
//   }
//   console.log('Query results:', results);
// });

// Close the connection (optional)
// connection.end((err) => {
//   if (err) {
//     console.error('Error closing the connection:', err);
//     return;
//   }
//   console.log('Database connection closed.');
// });

module.exports = connection;
