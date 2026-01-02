/**
 * Grade 1 Quarter-Based Curriculum Seeder
 * Creates 10-15 quizzes per quarter for Grade 1 students
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

// Grade 1 Quarter Topics - 10-15 quizzes per quarter
const grade1Quarters = {
  quarter1: [
    // Measurement and Geometry (MG) - Simple 2-dimensional shapes
    {
      topic_code: 'G1-Q1-MG-01',
      topic_title: 'Identify 2D Shapes',
      learning_outcome: 'Identify simple 2-dimensional shapes (triangle, rectangle, square) of different size and in different orientation',
      category: 'Geometry',
      order_index: 1
    },
    {
      topic_code: 'G1-Q1-MG-02',
      topic_title: 'Compare 2D Shapes',
      learning_outcome: 'Compare and distinguish 2-dimensional shapes according to features such as sides and corners',
      category: 'Geometry',
      order_index: 2
    },
    {
      topic_code: 'G1-Q1-MG-03',
      topic_title: 'Compose and Decompose Shapes',
      learning_outcome: 'Compose and decompose triangles, squares, and rectangles',
      category: 'Geometry',
      order_index: 3
    },
    // Number and Algebra (NA) - Whole numbers up to 100
    {
      topic_code: 'G1-Q1-NA-01',
      topic_title: 'Counting up to 100',
      learning_outcome: 'Count up to 100 (includes counting up or down from a given number and identifying a number that is 1 more or 1 less than a given number)',
      category: 'Number Sense',
      order_index: 4
    },
    {
      topic_code: 'G1-Q1-NA-02',
      topic_title: 'Read and Write Numerals up to 100',
      learning_outcome: 'Read and write numerals up to 100',
      category: 'Number Sense',
      order_index: 5
    },
    {
      topic_code: 'G1-Q1-NA-03',
      topic_title: 'Represent Numbers up to 100',
      learning_outcome: 'Recognize and represent numbers up to 100 using a variety of concrete and pictorial models (e.g., number line, block or bar models, and numerals)',
      category: 'Number Sense',
      order_index: 6
    },
    {
      topic_code: 'G1-Q1-NA-04',
      topic_title: 'Compare Numbers up to 20',
      learning_outcome: 'Compare two numbers up to 20',
      category: 'Number Sense',
      order_index: 7
    },
    {
      topic_code: 'G1-Q1-NA-05',
      topic_title: 'Order Numbers up to 20',
      learning_outcome: 'Order numbers up to 20 from smallest to largest, and vice versa',
      category: 'Number Sense',
      order_index: 8
    },
    // Number and Algebra (NA) - Ordinal numbers up to 10th
    {
      topic_code: 'G1-Q1-NA-06',
      topic_title: 'Ordinal Numbers 1st to 10th',
      learning_outcome: 'Describe the position of objects using ordinal numbers: 1st, 2nd, 3rd, up to 10th',
      category: 'Number Sense',
      order_index: 9
    },
    // Number and Algebra (NA) - Addition with sums up to 20
    {
      topic_code: 'G1-Q1-NA-07',
      topic_title: 'Compose and Decompose Numbers up to 10',
      learning_outcome: 'Compose and decompose numbers up to 10 using concrete materials (e.g., 5 is 5 and 0; 4 and 1; 3 and 2; 2 and 3; 1 and 4; 0 and 5)',
      category: 'Operations',
      order_index: 10
    },
    {
      topic_code: 'G1-Q1-NA-08',
      topic_title: 'Illustrate Addition up to 20',
      learning_outcome: 'Illustrate addition of numbers with sums up to 20 using a variety of concrete and pictorial models and describes addition as "counting up," and "putting together"',
      category: 'Operations',
      order_index: 11
    },
    {
      topic_code: 'G1-Q1-NA-09',
      topic_title: 'Properties of Addition',
      learning_outcome: 'Illustrate by applying the following properties of addition, using sums up to 20: a. the sum of zero and any number is equal to the number, and b. changing the order of the addends does not change the sum',
      category: 'Operations',
      order_index: 12
    },
    {
      topic_code: 'G1-Q1-NA-10',
      topic_title: 'Solve Addition Problems up to 20',
      learning_outcome: 'Solve problems (given orally or in pictures) involving addition with sums up to 20',
      category: 'Problem Solving',
      order_index: 13
    }
  ],
  
  quarter2: [
    // Measurement and Geometry (MG) - Length and Distance
    {
      topic_code: 'G1-Q2-MG-01',
      topic_title: 'Measure Length and Distance',
      learning_outcome: 'Measure the length of an object and the distance between two objects using non-standard units',
      category: 'Measurement',
      order_index: 1
    },
    {
      topic_code: 'G1-Q2-MG-02',
      topic_title: 'Compare Lengths and Distances',
      learning_outcome: 'Compare lengths and distances using non-standard units',
      category: 'Measurement',
      order_index: 2
    },
    {
      topic_code: 'G1-Q2-MG-03',
      topic_title: 'Solve Length Problems',
      learning_outcome: 'Solve problems involving lengths and distances using non-standard units',
      category: 'Problem Solving',
      order_index: 3
    },
    // Number and Algebra (NA) - Place Value
    {
      topic_code: 'G1-Q2-NA-01',
      topic_title: 'Place Value in 2-Digit Numbers',
      learning_outcome: 'Determine the place value of a digit in a 2-digit number, the value of a digit, and the digit of a number given its place value',
      category: 'Number Sense',
      order_index: 4
    },
    {
      topic_code: 'G1-Q2-NA-02',
      topic_title: 'Decompose 2-Digit Numbers',
      learning_outcome: 'Decompose any 2-digit number into tens and ones',
      category: 'Number Sense',
      order_index: 5
    },
    {
      topic_code: 'G1-Q2-NA-03',
      topic_title: 'Count by 2s, 5s, and 10s',
      learning_outcome: 'Count by 2s, 5s and 10s up to 100',
      category: 'Number Sense',
      order_index: 6
    },
    {
      topic_code: 'G1-Q2-NA-04',
      topic_title: 'Order Numbers up to 100',
      learning_outcome: 'Order numbers up to 100 from smallest to largest, and vice versa',
      category: 'Number Sense',
      order_index: 7
    },
    // Number and Algebra (NA) - Addition up to 100
    {
      topic_code: 'G1-Q2-NA-05',
      topic_title: 'Addition with Expanded Form',
      learning_outcome: 'Add numbers by expressing addends as tens and ones (expanded form)',
      category: 'Operations',
      order_index: 8
    },
    {
      topic_code: 'G1-Q2-NA-06',
      topic_title: 'Add 2-Digit and 1-Digit Numbers',
      learning_outcome: 'Add numbers with sums up to 100 without regrouping, using concrete and pictorial models: 2-digit and 1-digit numbers',
      category: 'Operations',
      order_index: 9
    },
    {
      topic_code: 'G1-Q2-NA-07',
      topic_title: 'Add 2-Digit and 2-Digit Numbers',
      learning_outcome: 'Add numbers with sums up to 100 without regrouping, using concrete and pictorial models: 2-digit and 2-digit numbers',
      category: 'Operations',
      order_index: 10
    },
    {
      topic_code: 'G1-Q2-NA-08',
      topic_title: 'Solve Addition Problems up to 100',
      learning_outcome: 'Solve problems (given orally or in pictures) involving addition with sums up to 100 without regrouping',
      category: 'Problem Solving',
      order_index: 11
    },
    // Data and Probability (DP) - Pictographs
    {
      topic_code: 'G1-Q2-DP-01',
      topic_title: 'Collect Data',
      learning_outcome: 'Collect data in one variable through a simple interview',
      category: 'Data',
      order_index: 12
    },
    {
      topic_code: 'G1-Q2-DP-02',
      topic_title: 'Present Data in Pictographs',
      learning_outcome: 'Present data in a pictograph without a scale',
      category: 'Data',
      order_index: 13
    },
    {
      topic_code: 'G1-Q2-DP-03',
      topic_title: 'Interpret Pictographs',
      learning_outcome: 'Interpret a pictograph without a scale',
      category: 'Data',
      order_index: 14
    },
    {
      topic_code: 'G1-Q2-DP-04',
      topic_title: 'Organize Pictograph Data',
      learning_outcome: 'Organize data in a pictograph without a scale into a table',
      category: 'Data',
      order_index: 15
    },
    // Number and Algebra (NA) - Subtraction
    {
      topic_code: 'G1-Q2-NA-09',
      topic_title: 'Illustrate Subtraction up to 20',
      learning_outcome: 'Illustrate subtraction involving numbers up to 20 using a variety of concrete and pictorial models, and describes subtraction as "taking away"',
      category: 'Operations',
      order_index: 16
    },
    {
      topic_code: 'G1-Q2-NA-10',
      topic_title: 'Find Missing Numbers',
      learning_outcome: 'Find the missing number in addition or subtraction sentences involving numbers up to 20',
      category: 'Operations',
      order_index: 17
    },
    {
      topic_code: 'G1-Q2-NA-11',
      topic_title: 'Equivalent Expressions',
      learning_outcome: 'Write an equivalent expression to a given addition or subtraction expression (e.g., 2+3 = 1+4; 10-5 = 6-1)',
      category: 'Operations',
      order_index: 18
    },
    {
      topic_code: 'G1-Q2-NA-12',
      topic_title: 'Solve Subtraction Problems up to 20',
      learning_outcome: 'Solve subtraction problems (given orally or in pictures) where both numbers are less than 20',
      category: 'Problem Solving',
      order_index: 19
    },
    {
      topic_code: 'G1-Q2-NA-13',
      topic_title: 'Subtract 2-Digit and 1-Digit Numbers',
      learning_outcome: 'Subtract numbers where both numbers are less than 100 using concrete and pictorial models, without regrouping: 2-digit minus 1-digit numbers',
      category: 'Operations',
      order_index: 20
    },
    {
      topic_code: 'G1-Q2-NA-14',
      topic_title: 'Subtract 2-Digit and 2-Digit Numbers',
      learning_outcome: 'Subtract numbers where both numbers are less than 100 using concrete and pictorial models, without regrouping: 2-digit minus 2-digit numbers',
      category: 'Operations',
      order_index: 21
    },
    {
      topic_code: 'G1-Q2-NA-15',
      topic_title: 'Subtract with Expanded Form',
      learning_outcome: 'Subtract numbers by expressing minuends and subtrahends as tens and ones (expanded form), without regrouping',
      category: 'Operations',
      order_index: 22
    },
    // Number and Algebra (NA) - Patterns
    {
      topic_code: 'G1-Q2-NA-16',
      topic_title: 'Determine Next Terms in Patterns',
      learning_outcome: 'Determine the next term/s in a repeating pattern (patterns could use rhythmic properties, visual elements in the arts, e.g., numbers: 2, 4, 2, 4__, __; letters: a, b, c, a, b, c, a, __, __)',
      category: 'Patterns',
      order_index: 23
    },
    {
      topic_code: 'G1-Q2-NA-17',
      topic_title: 'Create Repeating Patterns',
      learning_outcome: 'Create repeating patterns using objects, images, or numbers',
      category: 'Patterns',
      order_index: 24
    },
    // Number and Algebra (NA) - Fractions
    {
      topic_code: 'G1-Q2-NA-18',
      topic_title: 'Illustrate Fractions 1/2 and 1/4',
      learning_outcome: 'Illustrate 1/2 and 1/4 as parts of a whole',
      category: 'Number Sense',
      order_index: 25
    },
    {
      topic_code: 'G1-Q2-NA-19',
      topic_title: 'Compare Fractions 1/2 and 1/4',
      learning_outcome: 'Compare 1/2 and 1/4 using models',
      category: 'Number Sense',
      order_index: 26
    },
    {
      topic_code: 'G1-Q2-NA-20',
      topic_title: 'Count Halves and Quarters',
      learning_outcome: 'Count halves and quarters',
      category: 'Number Sense',
      order_index: 27
    },
    // Number and Algebra (NA) - Money
    {
      topic_code: 'G1-Q2-NA-21',
      topic_title: 'Philippine Coins and Bills up to ₱100',
      learning_outcome: 'Recognize coins (excluding centavo coins) and bills up to ₱100 and their notations',
      category: 'Measurement',
      order_index: 28
    },
    {
      topic_code: 'G1-Q2-NA-22',
      topic_title: 'Determine Value of Money',
      learning_outcome: 'Determine the value of a number of bills and/or a number of coins (excluding centavo coins) up to ₱100',
      category: 'Measurement',
      order_index: 29
    },
    {
      topic_code: 'G1-Q2-NA-23',
      topic_title: 'Compare Money Denominations',
      learning_outcome: 'Compare different denominations of peso coins (excluding centavo coins) and bills up to ₱100',
      category: 'Measurement',
      order_index: 30
    },
    {
      topic_code: 'G1-Q2-NA-24',
      topic_title: 'Solve Money Problems',
      learning_outcome: 'Solve 1-step problems (given orally or in pictures) involving addition of money where the sum is up to ₱100, or subtraction of money where both amounts are less than ₱100',
      category: 'Problem Solving',
      order_index: 31
    },
    // Measurement and Geometry (MG) - Movement
    {
      topic_code: 'G1-Q2-MG-04',
      topic_title: 'Half Turn and Quarter Turn',
      learning_outcome: 'Identify the position of objects moved in half turn or in quarter turn, in clockwise or in counter-clockwise direction, given an initial facing direction',
      category: 'Geometry',
      order_index: 32
    },
    // Measurement and Geometry (MG) - Time
    {
      topic_code: 'G1-Q2-MG-05',
      topic_title: 'Read and Write Time',
      learning_outcome: 'Read and write time by the hour, half hour, and quarter hour using an analog clock',
      category: 'Measurement',
      order_index: 33
    },
    {
      topic_code: 'G1-Q2-MG-06',
      topic_title: 'Days and Months Order',
      learning_outcome: 'Give the days of the week and months of the year in the correct order',
      category: 'Measurement',
      order_index: 34
    },
    {
      topic_code: 'G1-Q2-MG-07',
      topic_title: 'Use Calendar',
      learning_outcome: 'Determine the day and month of the year using a calendar',
      category: 'Measurement',
      order_index: 35
    },
    {
      topic_code: 'G1-Q2-MG-08',
      topic_title: 'Solve Time Problems',
      learning_outcome: 'Solve problems involving time (hour, half hour, quarter hour, days in a week, and months in a year)',
      category: 'Problem Solving',
      order_index: 36
    }
  ],
  
  quarter3: [
    {
      topic_code: 'G1-Q3-Quiz-01',
      topic_title: 'Addition with Regrouping',
      learning_outcome: 'Add two-digit numbers with sums up to 100',
      category: 'Operations',
      order_index: 1
    },
    {
      topic_code: 'G1-Q3-Quiz-02',
      topic_title: 'Subtraction within 100',
      learning_outcome: 'Subtract two-digit numbers within 100',
      category: 'Operations',
      order_index: 2
    },
    {
      topic_code: 'G1-Q3-Quiz-03',
      topic_title: 'Mixed Addition and Subtraction',
      learning_outcome: 'Solve problems with both addition and subtraction',
      category: 'Operations',
      order_index: 3
    },
    {
      topic_code: 'G1-Q3-Quiz-04',
      topic_title: 'Fractions - Half',
      learning_outcome: 'Recognize and represent one-half (1/2)',
      category: 'Number Sense',
      order_index: 4
    },
    {
      topic_code: 'G1-Q3-Quiz-05',
      topic_title: 'Fractions - Quarter',
      learning_outcome: 'Recognize and represent one-quarter (1/4)',
      category: 'Number Sense',
      order_index: 5
    },
    {
      topic_code: 'G1-Q3-Quiz-06',
      topic_title: 'Comparing Fractions',
      learning_outcome: 'Compare halves and quarters using visual models',
      category: 'Number Sense',
      order_index: 6
    },
    {
      topic_code: 'G1-Q3-Quiz-07',
      topic_title: 'Philippine Bills',
      learning_outcome: 'Identify Philippine bills: ₱20, ₱50, ₱100',
      category: 'Measurement',
      order_index: 7
    },
    {
      topic_code: 'G1-Q3-Quiz-08',
      topic_title: 'Money up to ₱100',
      learning_outcome: 'Count and combine coins and bills up to ₱100',
      category: 'Measurement',
      order_index: 8
    },
    {
      topic_code: 'G1-Q3-Quiz-09',
      topic_title: 'Money Word Problems',
      learning_outcome: 'Solve word problems involving money up to ₱100',
      category: 'Problem Solving',
      order_index: 9
    },
    {
      topic_code: 'G1-Q3-Quiz-10',
      topic_title: 'Length - Non-Standard Units',
      learning_outcome: 'Measure length using non-standard units (paper clips, cubes)',
      category: 'Measurement',
      order_index: 10
    },
    {
      topic_code: 'G1-Q3-Quiz-11',
      topic_title: 'Comparing Lengths',
      learning_outcome: 'Compare lengths using longer, shorter, same length',
      category: 'Measurement',
      order_index: 11
    },
    {
      topic_code: 'G1-Q3-Quiz-12',
      topic_title: 'Days of the Week',
      learning_outcome: 'Name and order days of the week',
      category: 'Measurement',
      order_index: 12
    },
    {
      topic_code: 'G1-Q3-Quiz-13',
      topic_title: 'Months of the Year',
      learning_outcome: 'Name and order months of the year',
      category: 'Measurement',
      order_index: 13
    },
    {
      topic_code: 'G1-Q3-Quiz-14',
      topic_title: 'Calendar Reading',
      learning_outcome: 'Read and use a calendar to find dates',
      category: 'Measurement',
      order_index: 14
    }
  ],
  
  quarter4: [
    {
      topic_code: 'G1-Q4-Quiz-01',
      topic_title: 'Pictographs - Reading',
      learning_outcome: 'Read and interpret simple pictographs without scale',
      category: 'Data',
      order_index: 1
    },
    {
      topic_code: 'G1-Q4-Quiz-02',
      topic_title: 'Pictographs - Creating',
      learning_outcome: 'Create simple pictographs to represent data',
      category: 'Data',
      order_index: 2
    },
    {
      topic_code: 'G1-Q4-Quiz-03',
      topic_title: 'Patterns - Colors and Shapes',
      learning_outcome: 'Create and extend patterns using colors and shapes',
      category: 'Patterns',
      order_index: 3
    },
    {
      topic_code: 'G1-Q4-Quiz-04',
      topic_title: 'Number Patterns',
      learning_outcome: 'Identify and extend simple number patterns',
      category: 'Patterns',
      order_index: 4
    },
    {
      topic_code: 'G1-Q4-Quiz-05',
      topic_title: 'Problem Solving - Addition',
      learning_outcome: 'Solve real-life problems using addition',
      category: 'Problem Solving',
      order_index: 5
    },
    {
      topic_code: 'G1-Q4-Quiz-06',
      topic_title: 'Problem Solving - Subtraction',
      learning_outcome: 'Solve real-life problems using subtraction',
      category: 'Problem Solving',
      order_index: 6
    },
    {
      topic_code: 'G1-Q4-Quiz-07',
      topic_title: 'Problem Solving - Mixed',
      learning_outcome: 'Solve problems using addition and subtraction',
      category: 'Problem Solving',
      order_index: 7
    },
    {
      topic_code: 'G1-Q4-Quiz-08',
      topic_title: 'Review - Numbers 1-100',
      learning_outcome: 'Review counting, reading, and writing numbers 1-100',
      category: 'Number Sense',
      order_index: 8
    },
    {
      topic_code: 'G1-Q4-Quiz-09',
      topic_title: 'Review - Addition and Subtraction',
      learning_outcome: 'Review addition and subtraction facts within 100',
      category: 'Operations',
      order_index: 9
    },
    {
      topic_code: 'G1-Q4-Quiz-10',
      topic_title: 'Review - Shapes and Patterns',
      learning_outcome: 'Review 2D shapes and pattern recognition',
      category: 'Geometry',
      order_index: 10
    },
    {
      topic_code: 'G1-Q4-Quiz-11',
      topic_title: 'Review - Money and Time',
      learning_outcome: 'Review money up to ₱100 and telling time',
      category: 'Measurement',
      order_index: 11
    },
    {
      topic_code: 'G1-Q4-Quiz-12',
      topic_title: 'Final Assessment Prep',
      learning_outcome: 'Practice all Grade 1 concepts for final assessment',
      category: 'Problem Solving',
      order_index: 12
    }
  ]
};

async function seedGrade1Quarters() {
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

    // Delete existing Grade 1 topics
    console.log('Clearing existing Grade 1 topics...');
    await dbRun(db, 'DELETE FROM curriculum_topics WHERE grade = 1');

    // Insert Grade 1 quarter topics
    console.log('Seeding Grade 1 quarter topics...');
    let inserted = 0;

    for (const [quarterName, topics] of Object.entries(grade1Quarters)) {
      const quarterNum = parseInt(quarterName.replace('quarter', ''));
      console.log(`\n📚 Quarter ${quarterNum}: ${topics.length} quizzes`);

      for (const topic of topics) {
        try {
          await dbRun(db, `
            INSERT INTO curriculum_topics 
            (grade, topic_code, topic_title, learning_outcome, category, order_index, quarter)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            1,
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

    console.log(`\n✅ Successfully inserted ${inserted} Grade 1 topics across 4 quarters`);
    console.log(`\n📊 Summary:`);
    console.log(`   Quarter 1: ${grade1Quarters.quarter1.length} quizzes`);
    console.log(`   Quarter 2: ${grade1Quarters.quarter2.length} quizzes`);
    console.log(`   Quarter 3: ${grade1Quarters.quarter3.length} quizzes`);
    console.log(`   Quarter 4: ${grade1Quarters.quarter4.length} quizzes`);
    console.log(`   Total: ${inserted} quizzes`);

    await dbClose(db);
  } catch (error) {
    console.error('❌ Error seeding Grade 1 quarters:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedGrade1Quarters()
    .then(() => {
      console.log('\n🎉 Grade 1 quarter seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedGrade1Quarters, grade1Quarters };

