/**
 * Script to create the initial admin account
 * Run this once to set up the admin account: node create-admin.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');
const bcrypt = require('bcrypt');

const dbPath = path.join(app.getPath('userData'), 'mathify.db');

// Default admin credentials (should be changed after first login)
const adminData = {
  fullName: 'Administrator',
  email: 'admin@mathify.local',
  password: 'Admin123!', // Change this after first login!
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
          console.log('Admin account already exists!');
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

          const query = `INSERT INTO users (full_name, email, password, user_type)
                        VALUES (?, ?, ?, ?)`;

          db.run(query, [
            adminData.fullName,
            adminData.email,
            hashedPassword,
            adminData.userType
          ], function(err) {
            db.close();
            if (err) {
              reject(err);
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
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error creating admin:', err);
      process.exit(1);
    });
}

module.exports = { createAdmin, adminData };


