/**
 * Script to manually create the admin account
 * Run this if the admin account doesn't exist: node create-admin-account.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const { app } = require('electron');

// Get database path (same as in database.js)
const dbPath = path.join(app.getPath('userData'), 'mathify.db');

const adminData = {
  fullName: 'Administrator',
  email: 'admin@mathify.local',
  password: 'Admin123!',
  userType: 'admin'
};

function createAdmin() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }

      // Check if admin already exists
      db.get("SELECT id FROM users WHERE email = ?", [adminData.email], (err, row) => {
        if (err) {
          db.close();
          reject(err);
          return;
        }

        if (row) {
          console.log('✅ Admin account already exists!');
          db.close();
          resolve({ exists: true });
          return;
        }

        // Hash password and create admin
        bcrypt.hash(adminData.password, 10, (err, hashedPassword) => {
          if (err) {
            db.close();
            reject(err);
            return;
          }

          const query = `INSERT INTO users (full_name, email, password, user_type, student_name, student_grade, student_code)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;

          db.run(query, [
            adminData.fullName,
            adminData.email,
            hashedPassword,
            adminData.userType,
            null, // student_name
            null, // student_grade
            null  // student_code
          ], function(err) {
            db.close();
            if (err) {
              if (err.message.includes('UNIQUE constraint failed')) {
                console.log('✅ Admin account already exists!');
                resolve({ exists: true });
              } else {
                console.error('❌ Error creating admin:', err.message);
                reject(err);
              }
              return;
            }
            console.log('✅ Admin account created successfully!');
            console.log('📧 Email:', adminData.email);
            console.log('🔑 Password:', adminData.password);
            console.log('⚠️  IMPORTANT: Change the password after first login!');
            resolve({ success: true, id: this.lastID });
          });
        });
      });
    });
  });
}

// Run if called directly
if (require.main === module) {
  createAdmin()
    .then(() => {
      console.log('\n✅ Done! You can now login with:');
      console.log('   Email: admin@mathify.local');
      console.log('   Password: Admin123!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = { createAdmin, adminData };


