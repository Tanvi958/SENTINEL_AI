const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: '139.84.163.32', // Replace with Vultr IP
  user: 'vultradmin', // Replace with your username
  password: 'AVNS_ZXzNZaNuX-5xbpLDBIs', // Replace with your password
  database: 'sentinel_ai',
});

// Connect to the database and test it
connection.connect((error) => {
  if (error) {
    console.error('Database connection failed:', error.stack);
    return;
  }
  console.log('Connected to the database.');
});
