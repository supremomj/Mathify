// Database Configuration for MariaDB
// Update these values to match your MariaDB setup

module.exports = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // Set your MariaDB root password here
  database: 'mathify',
  // Connection pool settings
  connectionLimit: 10,
  // Enable multiple statements (optional)
  multipleStatements: false
};



