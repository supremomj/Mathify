/**
 * Grade 2 Quarter-Based Curriculum Seeder
 * Creates 10-15 quizzes per quarter for Grade 2 students
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');
const fs = require('fs');

// Get database path (works both in Electron and standalone)
function getDatabasePath() {
  // Try Electron first
  try {
    const { app } = require('electron');
    return path.join(app.getPath('userData'), 'mathify.db');
  } catch (err) {
    // Fallback to standard paths
    const platform = process.platform;
    let dbDir, dbPath;
    if (platform === 'win32') {
      dbDir = path.join(os.homedir(), 'AppData', 'Roaming', 'mathify');
      dbPath = path.join(dbDir, 'mathify.db');
    } else if (platform === 'darwin') {
      dbDir = path.join(os.homedir(), 'Library', 'Application Support', 'mathify');
      dbPath = path.join(dbDir, 'mathify.db');
    } else {
      dbDir = path.join(os.homedir(), '.config', 'mathify');
      dbPath = path.join(dbDir, 'mathify.db');
    }
    
    // Ensure directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    return dbPath;
  }
}

const dbPath = getDatabasePath();
console.log('Using database path:', dbPath);

function getDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
}

function dbRun(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function dbClose(db) {
  return new Promise((resolve) => {
    db.close((err) => {
      if (err) console.error('Error closing database:', err);
      resolve();
    });
  });
}

// Grade 2 Quarter Topics - 10-15 quizzes per quarter
const grade2Quarters = {
  quarter1: [
    // Measurement and Geometry (MG) - Circles and Composite Figures
    {
      topic_code: 'G2-Q1-MG-01',
      topic_title: 'Represent Circles, Half Circles, Quarter Circles',
      learning_outcome: 'Represent and describe circles, half circles and quarter circles',
      category: 'Geometry',
      order_index: 1
    },
    {
      topic_code: 'G2-Q1-MG-02',
      topic_title: 'Compose Composite Figures',
      learning_outcome: 'Compose composite figures made up of squares, rectangles, triangles, circles, half circles, and quarter circles, using cut-outs and square grids',
      category: 'Geometry',
      order_index: 2
    },
    {
      topic_code: 'G2-Q1-MG-03',
      topic_title: 'Decompose Composite Figures',
      learning_outcome: 'Decompose composite figures made up of squares, rectangles, triangles, circles, half circles, and quarter circles',
      category: 'Geometry',
      order_index: 3
    },
    {
      topic_code: 'G2-Q1-MG-04',
      topic_title: 'One-Direction Multi-Step Slide',
      learning_outcome: 'Describe and draw the effect of one-direction multi-step slide (or translation) in basic shapes and figures',
      category: 'Geometry',
      order_index: 4
    },
    // Number and Algebra (NA) - Whole Numbers up to 1000
    {
      topic_code: 'G2-Q1-NA-01',
      topic_title: 'Count up to 1000',
      learning_outcome: 'Count up to 1000',
      category: 'Number Sense',
      order_index: 5
    },
    {
      topic_code: 'G2-Q1-NA-02',
      topic_title: 'Read and Write Numerals up to 1000',
      learning_outcome: 'Read and write numerals up to 1000',
      category: 'Number Sense',
      order_index: 6
    },
    {
      topic_code: 'G2-Q1-NA-03',
      topic_title: 'Represent Numbers up to 1000',
      learning_outcome: 'Recognize and represent numbers up to 1000 using a variety of concrete and pictorial models, and numerals',
      category: 'Number Sense',
      order_index: 7
    },
    {
      topic_code: 'G2-Q1-NA-04',
      topic_title: 'Count by 2s, 5s, 10s, 20s, 50s, and 100s',
      learning_outcome: 'Count by 2s, 5s, 10s, 20s, 50s, and 100s (not beyond 1000)',
      category: 'Number Sense',
      order_index: 8
    },
    {
      topic_code: 'G2-Q1-NA-05',
      topic_title: 'Order Numbers up to 1000',
      learning_outcome: 'Order numbers up to 1000 from smallest to largest, and vice versa',
      category: 'Number Sense',
      order_index: 9
    },
    {
      topic_code: 'G2-Q1-NA-06',
      topic_title: 'Ordinal Numbers up to 20th',
      learning_outcome: 'Describe the position of objects using ordinal numbers up to 20th',
      category: 'Number Sense',
      order_index: 10
    },
    {
      topic_code: 'G2-Q1-NA-07',
      topic_title: 'Place Value in 3-Digit Numbers',
      learning_outcome: 'Determine the place value of a digit in a 3-digit number, the value of a digit, and the digit of a number given its place value',
      category: 'Number Sense',
      order_index: 11
    },
    // Number and Algebra (NA) - Addition up to 1000
    {
      topic_code: 'G2-Q1-NA-08',
      topic_title: 'Illustrate Addition on Number Line',
      learning_outcome: 'Illustrate addition of 2-digit and by 1-digit numbers as "counting up" on the number line',
      category: 'Operations',
      order_index: 12
    },
    {
      topic_code: 'G2-Q1-NA-09',
      topic_title: 'Add Numbers in Expanded Form',
      learning_outcome: 'Add numbers with sums up to 1000 in expanded form',
      category: 'Operations',
      order_index: 13
    },
    {
      topic_code: 'G2-Q1-NA-10',
      topic_title: 'Add Numbers with Regrouping',
      learning_outcome: 'Add numbers with sums up to 1000, with or without regrouping',
      category: 'Operations',
      order_index: 14
    },
    {
      topic_code: 'G2-Q1-NA-11',
      topic_title: 'Properties of Addition',
      learning_outcome: 'Illustrate and apply the following properties of addition using sums up to 1000: a. the sum of zero and any number is equal to the number, b. changing the order of the addends does not change the sum, and c. changing the grouping of the addends does not change the sum',
      category: 'Operations',
      order_index: 15
    }
  ],
  
  quarter2: [
    // Number and Algebra (NA) - Money up to ₱1000
    {
      topic_code: 'G2-Q2-NA-01',
      topic_title: 'Determine Value of Money up to ₱1000',
      learning_outcome: 'Determine and write the value of a number of bills, or a number of coins, or a combination of bills and coins up to ₱1000 (centavo coins only, peso coins only, peso bills only, combined peso coins and peso bills)',
      category: 'Measurement',
      order_index: 1
    },
    {
      topic_code: 'G2-Q2-NA-02',
      topic_title: 'Compare Money Denominations',
      learning_outcome: 'Compare the values of different denominations of peso coins and bills up to ₱1000',
      category: 'Measurement',
      order_index: 2
    },
    {
      topic_code: 'G2-Q2-NA-03',
      topic_title: 'Solve Money Problems',
      learning_outcome: 'Solve problems involving addition with sums up to 1000, including problems involving money, with and without regrouping',
      category: 'Problem Solving',
      order_index: 3
    },
    // Measurement and Geometry (MG) - Length and Distance
    {
      topic_code: 'G2-Q2-MG-01',
      topic_title: 'Measure and Compare Lengths',
      learning_outcome: 'Measure and compare lengths of objects, in meters (m) or centimeters (cm), and distance in meters, using appropriate measuring tools',
      category: 'Measurement',
      order_index: 4
    },
    {
      topic_code: 'G2-Q2-MG-02',
      topic_title: 'Choose Appropriate Units',
      learning_outcome: 'Identify and use the appropriate unit (m or cm) to measure the length of an object and the distance between two locations',
      category: 'Measurement',
      order_index: 5
    },
    {
      topic_code: 'G2-Q2-MG-03',
      topic_title: 'Estimate Length and Distance',
      learning_outcome: 'Estimate length using meters or centimeters, and distance using meters',
      category: 'Measurement',
      order_index: 6
    },
    {
      topic_code: 'G2-Q2-MG-04',
      topic_title: 'Solve Length and Distance Problems',
      learning_outcome: 'Solve problems involving length and distance',
      category: 'Problem Solving',
      order_index: 7
    },
    // Number and Algebra (NA) - Subtraction
    {
      topic_code: 'G2-Q2-NA-04',
      topic_title: 'Illustrate Subtraction on Number Line',
      learning_outcome: 'Illustrate subtraction of 2-digit by 1-digit on the number line and as an inverse of addition',
      category: 'Operations',
      order_index: 8
    },
    {
      topic_code: 'G2-Q2-NA-05',
      topic_title: 'Subtract 2-Digit Numbers with Regrouping',
      learning_outcome: 'Subtract numbers where both numbers are less than 100 with regrouping: a. 2-digit minus 1-digit numbers, and b. 2-digit minus 2-digit numbers',
      category: 'Operations',
      order_index: 9
    },
    {
      topic_code: 'G2-Q2-NA-06',
      topic_title: 'Solve Subtraction Problems up to 100',
      learning_outcome: 'Solve problems (given orally or in pictures) involving subtraction where both numbers are less than 100, with and without regrouping',
      category: 'Problem Solving',
      order_index: 10
    },
    {
      topic_code: 'G2-Q2-NA-07',
      topic_title: 'Subtract Numbers up to 1000',
      learning_outcome: 'Subtract numbers, where both numbers are less than 1000, with and without regrouping',
      category: 'Operations',
      order_index: 11
    },
    {
      topic_code: 'G2-Q2-NA-08',
      topic_title: 'Solve Multi-Step Subtraction Problems',
      learning_outcome: 'Solve 1- and 2-step problems involving subtraction where both numbers are less than 1000 (including problems involving money), with and without regrouping',
      category: 'Problem Solving',
      order_index: 12
    },
    // Number and Algebra (NA) - Patterns
    {
      topic_code: 'G2-Q2-NA-09',
      topic_title: 'Determine Next Terms in Patterns',
      learning_outcome: 'Determine the next term/s in increasing or decreasing patterns, e.g., numbers, letters and rhythmic properties, visual elements in arts, and repetitions',
      category: 'Patterns',
      order_index: 13
    },
    {
      topic_code: 'G2-Q2-NA-10',
      topic_title: 'Create Increasing and Decreasing Patterns',
      learning_outcome: 'Create increasing or decreasing patterns',
      category: 'Patterns',
      order_index: 14
    }
  ],
  
  quarter3: [
    // Data and Probability (DP) - Pictographs with Scale
    {
      topic_code: 'G2-Q3-DP-01',
      topic_title: 'Present Data in Pictographs with Scale',
      learning_outcome: 'Present raw data, or data in tabular form, in a pictograph with a scale, or vice versa',
      category: 'Data',
      order_index: 1
    },
    {
      topic_code: 'G2-Q3-DP-02',
      topic_title: 'Interpret Pictographs with Scale',
      learning_outcome: 'Interpret data in tabular form and in a pictograph with or without scale',
      category: 'Data',
      order_index: 2
    },
    // Number and Algebra (NA) - Multiplication
    {
      topic_code: 'G2-Q3-NA-01',
      topic_title: 'Count Groups by Repeated Addition',
      learning_outcome: 'Count the number of concrete objects in a group by repeated addition and create equal groups, using language such as "5 groups of 3" and "5 threes"',
      category: 'Operations',
      order_index: 3
    },
    {
      topic_code: 'G2-Q3-NA-02',
      topic_title: 'Illustrate Multiplication',
      learning_outcome: 'Illustrate and write multiplication as repeated addition, using a variety of concrete and pictorial models and numerals, and using groups of equal quantities, arrays, counting by multiples, and equal jumps on a number line',
      category: 'Operations',
      order_index: 4
    },
    {
      topic_code: 'G2-Q3-NA-03',
      topic_title: 'Multiply Using Tables 2, 3, 4, 5, 10',
      learning_outcome: 'Multiply numbers using the 2, 3, 4, 5, and 10 multiplication tables',
      category: 'Operations',
      order_index: 5
    },
    {
      topic_code: 'G2-Q3-NA-04',
      topic_title: 'Solve Multiplication Problems',
      learning_outcome: 'Solve multiplication problems using the 2, 3, 4, 5, and 10 multiplication tables, including problems involving money',
      category: 'Problem Solving',
      order_index: 6
    },
    // Number and Algebra (NA) - Division
    {
      topic_code: 'G2-Q3-NA-05',
      topic_title: 'Illustrate Division as Equal Distribution',
      learning_outcome: 'Illustrate division through equal distribution of a number of objects into several groups',
      category: 'Operations',
      order_index: 7
    },
    {
      topic_code: 'G2-Q3-NA-06',
      topic_title: 'Illustrate Division Expressions',
      learning_outcome: 'Illustrate and write division expressions using a variety of concrete and pictorial models and numerals, in modelling division as equal sharing or formation of equal groups of objects, and repeated subtraction',
      category: 'Operations',
      order_index: 8
    },
    {
      topic_code: 'G2-Q3-NA-07',
      topic_title: 'Divide Using Tables 2, 3, 4, 5, 10',
      learning_outcome: 'Divide numbers using the 2, 3 4, 5, and 10 multiplication tables',
      category: 'Operations',
      order_index: 9
    },
    {
      topic_code: 'G2-Q3-NA-08',
      topic_title: 'Find Missing Numbers in Multiplication/Division',
      learning_outcome: 'Find the missing number in a number sentence involving multiplication or division by 2, 3, 4, 5, and 10',
      category: 'Operations',
      order_index: 10
    },
    {
      topic_code: 'G2-Q3-NA-09',
      topic_title: 'Distinguish Odd and Even Numbers',
      learning_outcome: 'Distinguish even and odd numbers using division by 2',
      category: 'Number Sense',
      order_index: 11
    },
    {
      topic_code: 'G2-Q3-NA-10',
      topic_title: 'Solve Division Problems',
      learning_outcome: 'Solve division problems using the 2, 3, 4, 5, and 10 multiplication tables, including problems involving money',
      category: 'Problem Solving',
      order_index: 12
    }
  ],
  
  quarter4: [
    // Number and Algebra (NA) - Fractions
    {
      topic_code: 'G2-Q4-NA-01',
      topic_title: 'Represent Unit Fractions',
      learning_outcome: 'Represent and identify unit fractions with denominators 2, 3, 4, 5, 6, and 8',
      category: 'Number Sense',
      order_index: 1
    },
    {
      topic_code: 'G2-Q4-NA-02',
      topic_title: 'Read and Write Unit Fractions',
      learning_outcome: 'Read and write unit fractions in fraction notation',
      category: 'Number Sense',
      order_index: 2
    },
    {
      topic_code: 'G2-Q4-NA-03',
      topic_title: 'Order Unit Fractions',
      learning_outcome: 'Order unit fractions from smallest to largest, and vice versa',
      category: 'Number Sense',
      order_index: 3
    },
    {
      topic_code: 'G2-Q4-NA-04',
      topic_title: 'Represent Similar Fractions',
      learning_outcome: 'Represent and identify similar fractions with denominators 2, 3, 4, 5, 6, and 8 using groups of objects, fraction charts, fraction tiles, and the number line',
      category: 'Number Sense',
      order_index: 4
    },
    {
      topic_code: 'G2-Q4-NA-05',
      topic_title: 'Read and Write Similar Fractions',
      learning_outcome: 'Read and write similar fractions in fraction notation',
      category: 'Number Sense',
      order_index: 5
    },
    {
      topic_code: 'G2-Q4-NA-06',
      topic_title: 'Order Similar Fractions',
      learning_outcome: 'Order similar fractions from smallest to largest, and vice versa',
      category: 'Number Sense',
      order_index: 6
    },
    // Measurement and Geometry (MG) - Time
    {
      topic_code: 'G2-Q4-MG-01',
      topic_title: 'Describe Duration of Events',
      learning_outcome: 'Describe the duration of an event in terms of number of days and/or weeks using a calendar',
      category: 'Measurement',
      order_index: 7
    },
    {
      topic_code: 'G2-Q4-MG-02',
      topic_title: 'Read and Write Time with a.m. and p.m.',
      learning_outcome: 'Read and write time in hours and minutes, with a.m. and p.m., using an analog clock',
      category: 'Measurement',
      order_index: 8
    },
    {
      topic_code: 'G2-Q4-MG-03',
      topic_title: 'Solve Elapsed Time Problems',
      learning_outcome: 'Solve problems involving elapsed time (minutes in an hour, hours in a day, days in a week), including timetables',
      category: 'Problem Solving',
      order_index: 9
    },
    // Measurement and Geometry (MG) - Lines and Surfaces
    {
      topic_code: 'G2-Q4-MG-04',
      topic_title: 'Identify Straight and Curved Lines',
      learning_outcome: 'Identify and explain the difference between straight and curved lines, and flat and curved surfaces of 3-dimensional objects',
      category: 'Geometry',
      order_index: 10
    },
    // Measurement and Geometry (MG) - Perimeter
    {
      topic_code: 'G2-Q4-MG-05',
      topic_title: 'Identify and Measure Perimeter',
      learning_outcome: 'Identify and measure the perimeter of a plane figure using appropriate tools',
      category: 'Geometry',
      order_index: 11
    },
    {
      topic_code: 'G2-Q4-MG-06',
      topic_title: 'Find Perimeter of Triangles, Squares, Rectangles',
      learning_outcome: 'Find the perimeter of triangles, squares, and rectangles',
      category: 'Geometry',
      order_index: 12
    },
    {
      topic_code: 'G2-Q4-MG-07',
      topic_title: 'Solve Perimeter Problems',
      learning_outcome: 'Solve problems involving perimeter of triangles, squares, and rectangles',
      category: 'Problem Solving',
      order_index: 13
    }
  ]
};

async function seedGrade2Quarters() {
  try {
    const db = await getDatabase();
    console.log('✓ Connected to database');

    // Update curriculum_topics table to include quarter column
    console.log('Updating curriculum_topics table...');
    try {
      await dbRun(db, `ALTER TABLE curriculum_topics ADD COLUMN quarter INTEGER`);
      console.log('✓ Added quarter column');
    } catch (err) {
      if (err.message.includes('duplicate column')) {
        console.log('✓ Quarter column already exists');
      } else {
        console.error('Error adding quarter column:', err.message);
      }
    }

    // Delete existing Grade 2 topics
    console.log('Clearing existing Grade 2 topics...');
    await dbRun(db, 'DELETE FROM curriculum_topics WHERE grade = 2');

    // Insert Grade 2 quarter topics
    console.log('Seeding Grade 2 quarter topics...');
    let inserted = 0;

    for (const [quarterName, topics] of Object.entries(grade2Quarters)) {
      const quarterNum = parseInt(quarterName.replace('quarter', ''));
      console.log(`\n📚 Quarter ${quarterNum}: ${topics.length} quizzes`);

      for (const topic of topics) {
        try {
          await dbRun(db, `
            INSERT INTO curriculum_topics 
            (grade, topic_code, topic_title, learning_outcome, category, order_index, quarter)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            2,
            topic.topic_code,
            topic.topic_title,
            topic.learning_outcome,
            topic.category,
            topic.order_index,
            quarterNum
          ]);
          inserted++;
          console.log(`  ✓ ${topic.topic_code}: ${topic.topic_title}`);
        } catch (err) {
          if (err.message.includes('UNIQUE constraint')) {
            console.log(`  ⚠️  ${topic.topic_code} already exists, skipping...`);
          } else {
            console.error(`  ❌ Error inserting ${topic.topic_code}:`, err.message);
          }
        }
      }
    }

    console.log(`\n✅ Successfully inserted ${inserted} Grade 2 topics across 4 quarters`);
    console.log(`\n📊 Summary:`);
    console.log(`   Quarter 1: ${grade2Quarters.quarter1.length} quizzes`);
    console.log(`   Quarter 2: ${grade2Quarters.quarter2.length} quizzes`);
    console.log(`   Quarter 3: ${grade2Quarters.quarter3.length} quizzes`);
    console.log(`   Quarter 4: ${grade2Quarters.quarter4.length} quizzes`);
    console.log(`   Total: ${inserted} quizzes`);

    await dbClose(db);
  } catch (error) {
    console.error('❌ Error seeding Grade 2 quarters:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedGrade2Quarters()
    .then(() => {
      console.log('\n🎉 Grade 2 quarter seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedGrade2Quarters, grade2Quarters };

