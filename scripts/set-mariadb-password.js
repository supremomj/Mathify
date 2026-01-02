// Helper script to set MariaDB root password
// Usage: node set-mariadb-password.js

const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setPassword() {
  try {
    console.log('Attempting to connect to MariaDB...\n');
    
    // Try connecting without password first
    let connection;
    try {
      connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: ''
      });
      console.log('✓ Connected to MariaDB (no password required)\n');
    } catch (err) {
      // If that fails, try with auth plugin workaround
      console.log('Trying alternative connection method...\n');
      try {
        connection = await mysql.createConnection({
          host: 'localhost',
          port: 3306,
          user: 'root',
          password: '',
          authPlugins: {
            mysql_native_password: () => () => Buffer.alloc(0)
          }
        });
        console.log('✓ Connected to MariaDB\n');
      } catch (err2) {
        console.error('✗ Cannot connect to MariaDB');
        console.error('Error:', err2.message);
        console.error('\nPlease make sure:');
        console.error('1. MariaDB service is running');
        console.error('2. MariaDB is installed correctly');
        rl.close();
        process.exit(1);
      }
    }

    const password = await new Promise(resolve => {
      rl.question('Enter new password for root user: ', resolve);
    });

    const confirmPassword = await new Promise(resolve => {
      rl.question('Confirm password: ', resolve);
    });

    if (password !== confirmPassword) {
      console.error('✗ Passwords do not match!');
      await connection.end();
      rl.close();
      process.exit(1);
    }

    if (!password || password.trim().length === 0) {
      console.error('✗ Password cannot be empty!');
      await connection.end();
      rl.close();
      process.exit(1);
    }

    console.log('\nSetting password...');
    await connection.query(`ALTER USER 'root'@'localhost' IDENTIFIED BY ?`, [password]);
    await connection.query('FLUSH PRIVILEGES');
    await connection.end();

    console.log('✓ Password set successfully!\n');
    console.log('⚠️  IMPORTANT: Update db-config.js with this password:');
    console.log(`   password: '${password}',\n`);
    
    rl.close();
  } catch (err) {
    console.error('✗ Error setting password:', err.message);
    rl.close();
    process.exit(1);
  }
}

setPassword();


