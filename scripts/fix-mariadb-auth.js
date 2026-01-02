// Script to fix MariaDB authentication plugin issue
// This script helps configure MariaDB to use mysql_native_password

const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function fixAuth() {
  console.log('MariaDB Authentication Fix\n');
  console.log('This script will help you configure MariaDB to use mysql_native_password.\n');
  
  try {
    // Try to connect with various methods
    let connection;
    let connected = false;
    
    // Method 1: Try with empty password
    try {
      connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        authPlugins: {
          mysql_native_password: () => () => Buffer.alloc(0),
          gssapi_client: () => () => Buffer.alloc(0)
        }
      });
      connected = true;
      console.log('✓ Connected to MariaDB\n');
    } catch (err) {
      console.log('✗ Could not connect with empty password\n');
    }
    
    // Method 2: Try to get password from user
    if (!connected) {
      const password = await new Promise(resolve => {
        rl.question('Enter MariaDB root password (or press Enter to skip): ', resolve);
      });
      
      if (password) {
        try {
          connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: password,
            authPlugins: {
              mysql_native_password: () => () => Buffer.alloc(0),
              gssapi_client: () => () => Buffer.alloc(0)
            }
          });
          connected = true;
          console.log('✓ Connected to MariaDB\n');
        } catch (err) {
          console.log('✗ Could not connect with provided password\n');
        }
      }
    }
    
    if (!connected) {
      console.log('\n⚠️  Cannot connect to MariaDB automatically.');
      console.log('\nPlease run these SQL commands manually in MariaDB:\n');
      console.log('1. Connect to MariaDB using the command line or a GUI tool');
      console.log('2. Run these commands:\n');
      console.log('   ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'your_password\';');
      console.log('   FLUSH PRIVILEGES;\n');
      console.log('3. Update db-config.js with the password you set\n');
      rl.close();
      return;
    }
    
    // Get new password
    const newPassword = await new Promise(resolve => {
      rl.question('Enter new password for root user (or press Enter to keep current): ', resolve);
    });
    
    if (newPassword && newPassword.trim()) {
      console.log('\nSetting password and configuring authentication...');
      try {
        await connection.query(`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ?`, [newPassword]);
        await connection.query('FLUSH PRIVILEGES');
        console.log('✓ Password set and authentication configured!\n');
        console.log('⚠️  IMPORTANT: Update db-config.js with this password:');
        console.log(`   password: '${newPassword}',\n`);
      } catch (err) {
        console.error('✗ Error:', err.message);
        console.log('\nYou may need to run this command manually in MariaDB:');
        console.log(`   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${newPassword}';`);
        console.log('   FLUSH PRIVILEGES;\n');
      }
    } else {
      // Just fix the authentication method without changing password
      console.log('\nConfiguring authentication method...');
      try {
        // Try to get current password hash and update auth method
        const [rows] = await connection.query("SELECT authentication_string FROM mysql.user WHERE User='root' AND Host='localhost'");
        if (rows.length > 0) {
          await connection.query(`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password`);
          await connection.query('FLUSH PRIVILEGES');
          console.log('✓ Authentication method configured!\n');
        }
      } catch (err) {
        console.error('✗ Error:', err.message);
        console.log('\nYou may need to run this command manually in MariaDB:');
        console.log('   ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password;');
        console.log('   FLUSH PRIVILEGES;\n');
      }
    }
    
    await connection.end();
    rl.close();
    
    console.log('✓ Done! You can now try connecting again.\n');
    
  } catch (err) {
    console.error('✗ Error:', err.message);
    rl.close();
    process.exit(1);
  }
}

fixAuth();


