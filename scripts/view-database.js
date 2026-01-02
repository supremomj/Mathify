// Script to view database contents
// Run with: node view-database.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');

// Determine database path based on OS
function getDatabasePath() {
  const platform = process.platform;
  let dbPath;
  
  if (platform === 'win32') {
    // Windows: %APPDATA%/mathify/mathify.db
    dbPath = path.join(os.homedir(), 'AppData', 'Roaming', 'mathify', 'mathify.db');
  } else if (platform === 'darwin') {
    // macOS: ~/Library/Application Support/mathify/mathify.db
    dbPath = path.join(os.homedir(), 'Library', 'Application Support', 'mathify', 'mathify.db');
  } else {
    // Linux: ~/.config/mathify/mathify.db
    dbPath = path.join(os.homedir(), '.config', 'mathify', 'mathify.db');
  }
  
  return dbPath;
}

const dbPath = getDatabasePath();
console.log('Database location:', dbPath);
console.log('');

// Open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    console.log('\nNote: The database will be created when you first run the app.');
    process.exit(1);
  }
  console.log('Connected to SQLite database\n');
});

// View all users
function viewUsers() {
  return new Promise((resolve, reject) => {
    console.log('=== USERS ===');
    db.all('SELECT id, full_name, email, user_type, student_name, student_grade, created_at FROM users', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows.length === 0) {
        console.log('No users found.\n');
      } else {
        rows.forEach((row) => {
          console.log(`ID: ${row.id}`);
          console.log(`  Name: ${row.full_name}`);
          console.log(`  Email: ${row.email}`);
          console.log(`  Type: ${row.user_type}`);
          if (row.student_name) {
            console.log(`  Student Name: ${row.student_name}`);
          }
          if (row.student_grade) {
            console.log(`  Grade: ${row.student_grade}`);
          }
          console.log(`  Created: ${row.created_at}`);
          console.log('');
        });
      }
      resolve();
    });
  });
}

// View all children
function viewChildren() {
  return new Promise((resolve, reject) => {
    console.log('=== CHILDREN ===');
    db.all('SELECT id, parent_id, name, grade, created_at FROM children', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows.length === 0) {
        console.log('No children found.\n');
      } else {
        rows.forEach((row) => {
          console.log(`ID: ${row.id}`);
          console.log(`  Parent ID: ${row.parent_id}`);
          console.log(`  Name: ${row.name}`);
          console.log(`  Grade: ${row.grade || 'N/A'}`);
          console.log(`  Created: ${row.created_at}`);
          console.log('');
        });
      }
      resolve();
    });
  });
}

// View database schema
function viewSchema() {
  return new Promise((resolve, reject) => {
    console.log('=== DATABASE SCHEMA ===');
    db.all("SELECT name, sql FROM sqlite_master WHERE type='table'", [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      rows.forEach((row) => {
        console.log(`\nTable: ${row.name}`);
        console.log(row.sql);
        console.log('');
      });
      resolve();
    });
  });
}

// Main function
async function main() {
  try {
    await viewSchema();
    await viewUsers();
    await viewChildren();
    
    console.log('=== SUMMARY ===');
    db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
      if (!err) {
        console.log(`Total Users: ${row.count}`);
      }
    });
    
    db.get('SELECT COUNT(*) as count FROM children', [], (err, row) => {
      if (!err) {
        console.log(`Total Children: ${row.count}`);
      }
      
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('\nDatabase connection closed.');
        }
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    db.close();
    process.exit(1);
  }
}

main();

