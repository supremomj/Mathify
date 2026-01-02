// Verify curriculum data
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'mathify.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }

  db.all('SELECT grade, COUNT(*) as count FROM curriculum_topics GROUP BY grade ORDER BY grade', (err, rows) => {
    if (err) {
      console.error('Error:', err);
      db.close();
      process.exit(1);
    }

    console.log('\n📚 Curriculum Topics by Grade:\n');
    let total = 0;
    rows.forEach(r => {
      console.log(`  Grade ${r.grade}: ${r.count} topics`);
      total += r.count;
    });
    console.log(`\n  Total: ${total} topics\n`);

    // Show sample topics for each grade
    db.all('SELECT grade, topic_title, category FROM curriculum_topics ORDER BY grade, order_index LIMIT 5', (err, samples) => {
      if (!err && samples.length > 0) {
        console.log('Sample Topics:');
        samples.forEach(t => {
          console.log(`  Grade ${t.grade}: ${t.topic_title} (${t.category})`);
        });
      }
      db.close();
    });
  });
});


