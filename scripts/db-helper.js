// Database Helper Script - Easy database management
// Usage: node db-helper.js [command]

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');
const readline = require('readline');

// Get database path
function getDatabasePath() {
  const platform = process.platform;
  if (platform === 'win32') {
    return path.join(os.homedir(), 'AppData', 'Roaming', 'mathify', 'mathify.db');
  } else if (platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'mathify', 'mathify.db');
  } else {
    return path.join(os.homedir(), '.config', 'mathify', 'mathify.db');
  }
}

const dbPath = getDatabasePath();

// Initialize database (create tables if they don't exist)
function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('✓ Database opened:', dbPath);
      
      const queries = [
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          user_type TEXT NOT NULL CHECK(user_type IN ('parent', 'student')),
          student_name TEXT,
          student_grade INTEGER,
          student_code TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS children (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          parent_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          grade INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (parent_id) REFERENCES users(id)
        )`,
        `CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )`
      ];

      let completed = 0;
      queries.forEach((query, index) => {
        db.run(query, (err) => {
          if (err) {
            console.error(`✗ Error creating table ${index + 1}:`, err.message);
            reject(err);
            return;
          }
          completed++;
          if (completed === queries.length) {
            console.log('✓ Database tables initialized successfully');
            db.close();
            resolve();
          }
        });
      });
    });
  });
}

// View all data
function viewAll() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }

      console.log('\n=== DATABASE SUMMARY ===\n');
      
      // Count users
      db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
        if (!err) {
          console.log(`Total Users: ${row.count}`);
        }
      });

      // Count children
      db.get('SELECT COUNT(*) as count FROM children', [], (err, row) => {
        if (!err) {
          console.log(`Total Children: ${row.count}\n`);
        }
      });

      // View users
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
            console.log(`[${row.id}] ${row.full_name} (${row.user_type})`);
            console.log(`   Email: ${row.email}`);
            if (row.student_name) console.log(`   Student: ${row.student_name}`);
            if (row.student_grade) console.log(`   Grade: ${row.student_grade}`);
            console.log(`   Created: ${row.created_at}\n`);
          });
        }

        // View children
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
              console.log(`[${row.id}] ${row.name} (Grade ${row.grade || 'N/A'})`);
              console.log(`   Parent ID: ${row.parent_id}`);
              console.log(`   Created: ${row.created_at}\n`);
            });
          }

          db.close();
          resolve();
        });
      });
    });
  });
}

// Reset database (WARNING: Deletes all data!)
function resetDatabase() {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('⚠️  WARNING: This will delete ALL data! Type "yes" to confirm: ', (answer) => {
      rl.close();
      if (answer.toLowerCase() !== 'yes') {
        console.log('Reset cancelled.');
        resolve();
        return;
      }

      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        db.serialize(() => {
          db.run('DROP TABLE IF EXISTS sessions', (err) => {
            if (err) console.error('Error dropping sessions:', err);
          });
          db.run('DROP TABLE IF EXISTS children', (err) => {
            if (err) console.error('Error dropping children:', err);
          });
          db.run('DROP TABLE IF EXISTS users', (err) => {
            if (err) console.error('Error dropping users:', err);
          });
        });

        db.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          console.log('✓ Database reset. Reinitializing...');
          initDatabase().then(() => {
            console.log('✓ Database ready for use.');
            resolve();
          }).catch(reject);
        });
      });
    });
  });
}

// Main command handler
const command = process.argv[2] || 'view';

async function main() {
  try {
    switch (command) {
      case 'init':
        await initDatabase();
        break;
      case 'view':
        await viewAll();
        break;
      case 'reset':
        await resetDatabase();
        break;
      case 'help':
        console.log(`
Database Helper Commands:
  node db-helper.js init   - Initialize/create database tables
  node db-helper.js view   - View all data (default)
  node db-helper.js reset   - Reset database (deletes all data)
  node db-helper.js help   - Show this help message

Database Location: ${dbPath}
        `);
        break;
      default:
        console.log(`Unknown command: ${command}`);
        console.log('Use "node db-helper.js help" for available commands.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

