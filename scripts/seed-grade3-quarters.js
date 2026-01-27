/**
 * Grade 3 Quarter-Based Curriculum Seeder
 * Creates structured quizzes per quarter for Grade 3 students
 * Based on DepEd MATATAG Grade 3 Curriculum you provided
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
    db.run(sql, params, function (err) {
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

// Grade 3 Quarter Topics - aligned with the curriculum you sent
const grade3Quarters = {
  // Quarter 1 – Measurement & Geometry, Number & Algebra
  quarter1: [
    // Measurement and Geometry (MG) – Area of squares and rectangles
    {
      topic_code: 'G3-Q1-MG-01',
      topic_title: 'Estimate Area of Squares and Rectangles',
      learning_outcome:
        'Illustrate and estimate the area of a square or rectangle using square tile units.',
      category: 'Measurement',
      order_index: 1,
    },
    {
      topic_code: 'G3-Q1-MG-02',
      topic_title: 'Derive Area Formulas',
      learning_outcome:
        'Explore inductively the derivation of the formulas for the areas of a square and a rectangle using square tile units.',
      category: 'Measurement',
      order_index: 2,
    },
    {
      topic_code: 'G3-Q1-MG-03',
      topic_title: 'Find Area in Square Centimeters and Meters',
      learning_outcome:
        'Find the areas of squares and rectangles in square centimeters (sq. cm) and square meters (sq. m).',
      category: 'Measurement',
      order_index: 3,
    },
    {
      topic_code: 'G3-Q1-MG-04',
      topic_title: 'Solve Problems Involving Area',
      learning_outcome:
        'Solve problems involving areas of squares and rectangles.',
      category: 'Problem Solving',
      order_index: 4,
    },
    {
      topic_code: 'G3-Q1-MG-05',
      topic_title: 'Points, Lines, Line Segments, and Rays',
      learning_outcome:
        'Recognize, using models, and draw a point, line, line segment, and ray.',
      category: 'Geometry',
      order_index: 5,
    },
    {
      topic_code: 'G3-Q1-MG-06',
      topic_title: 'Parallel, Perpendicular, and Intersecting Lines',
      learning_outcome:
        'Recognize and draw parallel, intersecting, and perpendicular lines.',
      category: 'Geometry',
      order_index: 6,
    },
    {
      topic_code: 'G3-Q1-MG-07',
      topic_title: 'Line Segments of Equal Length',
      learning_outcome:
        'Identify and draw line segments of equal length using a ruler.',
      category: 'Geometry',
      order_index: 7,
    },
    // Number and Algebra (NA) – Whole numbers up to 10 000, ordinals up to 100th
    {
      topic_code: 'G3-Q1-NA-01',
      topic_title: 'Represent Numbers up to 10 000',
      learning_outcome:
        'Represent numbers up to 10 000 using pictorial models and numerals.',
      category: 'Number Sense',
      order_index: 8,
    },
    {
      topic_code: 'G3-Q1-NA-02',
      topic_title: 'Read and Write Numbers up to 10 000',
      learning_outcome:
        'Read and write numbers up to 10 000 in numerals and in words.',
      category: 'Number Sense',
      order_index: 9,
    },
    {
      topic_code: 'G3-Q1-NA-03',
      topic_title: 'Use Ordinal Numbers up to 100th',
      learning_outcome:
        'Describe the position of objects using ordinal numbers up to 100th.',
      category: 'Number Sense',
      order_index: 10,
    },
    {
      topic_code: 'G3-Q1-NA-04',
      topic_title: 'Place Value in 4-Digit Numbers',
      learning_outcome:
        'Determine the place value of a digit in a 4-digit number, the value of a digit, and the digit of a number given its place value.',
      category: 'Number Sense',
      order_index: 11,
    },
    {
      topic_code: 'G3-Q1-NA-05',
      topic_title: 'Round Numbers to Tens, Hundreds, and Thousands',
      learning_outcome:
        'Round numbers to the nearest ten, hundred, or thousand.',
      category: 'Number Sense',
      order_index: 12,
    },
    {
      topic_code: 'G3-Q1-NA-06',
      topic_title: 'Compare and Order Numbers up to 10 000',
      learning_outcome:
        'Compare numbers up to 10 000 using the symbols =, >, and <, and order numbers up to 10 000 from smallest to largest, and vice versa.',
      category: 'Number Sense',
      order_index: 13,
    },
  ],

  // Quarter 2 – Mass, capacity, addition and subtraction up to 4 digits
  quarter2: [
    // Measurement and Geometry (MG) – Mass and capacity
    {
      topic_code: 'G3-Q2-MG-01',
      topic_title: 'Measure Mass in g, kg, and mg',
      learning_outcome:
        'Measure mass in grams (g), kilograms (kg), and milligrams (mg) using appropriate measuring tools.',
      category: 'Measurement',
      order_index: 1,
    },
    {
      topic_code: 'G3-Q2-MG-02',
      topic_title: 'Estimate and Compare Mass',
      learning_outcome:
        'Estimate mass of an object using grams, kilograms, and milligrams, and compare masses of objects including the use of a balance scale.',
      category: 'Measurement',
      order_index: 2,
    },
    {
      topic_code: 'G3-Q2-MG-03',
      topic_title: 'Measure Capacity in L and mL',
      learning_outcome:
        'Measure capacity in liters (L) and milliliters (mL) using appropriate measuring tools.',
      category: 'Measurement',
      order_index: 3,
    },
    {
      topic_code: 'G3-Q2-MG-04',
      topic_title: 'Estimate and Compare Capacity',
      learning_outcome:
        'Estimate capacity using liters and milliliters and compare capacities of two containers.',
      category: 'Measurement',
      order_index: 4,
    },
    // Number and Algebra (NA) – Addition and subtraction up to 4 digits, money up to ₱10 000
    {
      topic_code: 'G3-Q2-NA-01',
      topic_title: 'Read and Write Money up to ₱10 000',
      learning_outcome:
        'Read and write money in words and using Philippine currency symbols (₱ and PhP) up to ₱10 000, and the centavo sign.',
      category: 'Measurement',
      order_index: 5,
    },
    {
      topic_code: 'G3-Q2-NA-02',
      topic_title: 'Add Numbers up to 10 000',
      learning_outcome:
        'Add numbers with sums up to 10 000, with and without regrouping.',
      category: 'Operations',
      order_index: 6,
    },
    {
      topic_code: 'G3-Q2-NA-03',
      topic_title: 'Estimate Sums of 4-Digit Numbers',
      learning_outcome:
        'Estimate the sum of addends with up to 4 digits.',
      category: 'Operations',
      order_index: 7,
    },
    {
      topic_code: 'G3-Q2-NA-04',
      topic_title: 'Solve Addition Problems up to 10 000',
      learning_outcome:
        'Solve problems involving addition of numbers with sums up to 10 000, including problems involving money.',
      category: 'Problem Solving',
      order_index: 8,
    },
    {
      topic_code: 'G3-Q2-NA-05',
      topic_title: 'Subtract Numbers less than 10 000',
      learning_outcome:
        'Subtract numbers, where both numbers are less than 10 000, with and without regrouping.',
      category: 'Operations',
      order_index: 9,
    },
    {
      topic_code: 'G3-Q2-NA-06',
      topic_title: 'Estimate Differences of 4-Digit Numbers',
      learning_outcome:
        'Estimate the difference of two numbers of up to 4 digits.',
      category: 'Operations',
      order_index: 10,
    },
    {
      topic_code: 'G3-Q2-NA-07',
      topic_title: 'Add and Subtract Multiple Numbers',
      learning_outcome:
        'Perform addition and subtraction of 3 to 4 numbers of up to 2 digits, observing the correct order of operations.',
      category: 'Operations',
      order_index: 11,
    },
    {
      topic_code: 'G3-Q2-NA-08',
      topic_title: 'Solve Multi-Step Addition and Subtraction Problems',
      learning_outcome:
        'Solve problems involving addition and subtraction with 3 to 4 numbers of up to 2 digits, including problems involving money.',
      category: 'Problem Solving',
      order_index: 12,
    },
  ],

  // Quarter 3 – Data, Probability, Multiplication, Patterns
  quarter3: [
    // Data and Probability (DP)
    {
      topic_code: 'G3-Q3-DP-01',
      topic_title: 'Collect Data from Experiments',
      learning_outcome:
        'Collect data from experiments with a small number of possible outcomes, such as rolling a die or tossing a coin.',
      category: 'Data',
      order_index: 1,
    },
    {
      topic_code: 'G3-Q3-DP-02',
      topic_title: 'Present Data in Tables and Bar Graphs',
      learning_outcome:
        'Present data in tables and single bar graphs (horizontal and vertical).',
      category: 'Data',
      order_index: 2,
    },
    {
      topic_code: 'G3-Q3-DP-03',
      topic_title: 'Interpret Tables and Bar Graphs',
      learning_outcome:
        'Interpret data in tables and single bar graphs (horizontal and vertical).',
      category: 'Data',
      order_index: 3,
    },
    {
      topic_code: 'G3-Q3-DP-04',
      topic_title: 'Solve Problems Using Bar Graphs',
      learning_outcome:
        'Solve problems using data presented in a single bar graph (horizontal and vertical).',
      category: 'Problem Solving',
      order_index: 4,
    },
    {
      topic_code: 'G3-Q3-DP-05',
      topic_title: 'Describe Outcomes of Events',
      learning_outcome:
        'Describe and compare outcomes in real-life situations using the terms equally likely, less/least likely, more/most likely, certain, and impossible.',
      category: 'Data',
      order_index: 5,
    },
    // Number and Algebra (NA) – Multiplication and patterns
    {
      topic_code: 'G3-Q3-NA-01',
      topic_title: 'Multiply Using Tables 6, 7, 8, and 9',
      learning_outcome:
        'Multiply numbers using the 6, 7, 8, and 9 multiplication tables.',
      category: 'Operations',
      order_index: 6,
    },
    {
      topic_code: 'G3-Q3-NA-02',
      topic_title: 'Properties of Multiplication (6–9 Tables)',
      learning_outcome:
        'Illustrate and apply properties of multiplication for the 6, 7, 8, and 9 multiplication tables, including identity, zero, commutative, associative, and distributive properties.',
      category: 'Operations',
      order_index: 7,
    },
    {
      topic_code: 'G3-Q3-NA-03',
      topic_title: 'Multiply 2- to 4-Digit Numbers',
      learning_outcome:
        'Multiply numbers with and without regrouping, including 2- to 3-digit numbers by a 1-digit number and 2- to 4-digit numbers by a number whose leading digit is the only non-zero digit, with products up to 10 000.',
      category: 'Operations',
      order_index: 8,
    },
    {
      topic_code: 'G3-Q3-NA-04',
      topic_title: 'Estimate Products by Rounding',
      learning_outcome:
        'Estimate the product of 2- to 3-digit numbers by 1- to 2-digit numbers by estimating the factors using multiples of 10.',
      category: 'Operations',
      order_index: 9,
    },
    {
      topic_code: 'G3-Q3-NA-05',
      topic_title: 'Solve Multiplication Word Problems',
      learning_outcome:
        'Solve 1- to 2-step multiplication problems, including problems involving money.',
      category: 'Problem Solving',
      order_index: 10,
    },
    {
      topic_code: 'G3-Q3-NA-06',
      topic_title: 'Find Missing Terms in Patterns',
      learning_outcome:
        'Determine the missing term or terms in a pattern with repeating and increasing components or repeating and decreasing components.',
      category: 'Patterns',
      order_index: 11,
    },
    {
      topic_code: 'G3-Q3-NA-07',
      topic_title: 'Generate Repeating and Increasing/Decreasing Patterns',
      learning_outcome:
        'Explain how to generate a given pattern with repeating and increasing components or repeating and decreasing components, and generate similar patterns.',
      category: 'Patterns',
      order_index: 12,
    },
  ],

  // Quarter 4 – Division, similar fractions, symmetry and translation
  quarter4: [
    // Number and Algebra (NA) – Division and fractions
    {
      topic_code: 'G3-Q4-NA-01',
      topic_title: 'Illustrate Division on a Number Line',
      learning_outcome:
        'Illustrate division through equal jumps on the number line and as the inverse of multiplication.',
      category: 'Operations',
      order_index: 1,
    },
    {
      topic_code: 'G3-Q4-NA-02',
      topic_title: 'Divide Using 6, 7, 8, and 9 Tables',
      learning_outcome:
        'Divide numbers using the 6, 7, 8, and 9 multiplication tables.',
      category: 'Operations',
      order_index: 2,
    },
    {
      topic_code: 'G3-Q4-NA-03',
      topic_title: 'Find Missing Numbers in Multiplication and Division Sentences',
      learning_outcome:
        'Find the missing number in a number sentence involving multiplication or division by 6, 7, 8, and 9.',
      category: 'Operations',
      order_index: 3,
    },
    {
      topic_code: 'G3-Q4-NA-04',
      topic_title: 'Divide 2- to 4-Digit Numbers',
      learning_outcome:
        'Divide numbers with and without remainder, including 2- to 3-digit numbers by a 1-digit number without remainder, 2-digit numbers by a 1-digit number with remainder, and 2- to 4-digit numbers by 10, 100, and 1000.',
      category: 'Operations',
      order_index: 4,
    },
    {
      topic_code: 'G3-Q4-NA-05',
      topic_title: 'Estimate Quotients by Rounding',
      learning_outcome:
        'Estimate the quotient of 2- to 3-digit numbers divided by 1- to 2-digit numbers using multiples of 10 or 100 as appropriate.',
      category: 'Operations',
      order_index: 5,
    },
    {
      topic_code: 'G3-Q4-NA-06',
      topic_title: 'Solve Division Word Problems',
      learning_outcome:
        'Solve division problems involving 2- to 3-digit numbers by a 1-digit number, including problems involving money.',
      category: 'Problem Solving',
      order_index: 6,
    },
    {
      topic_code: 'G3-Q4-NA-07',
      topic_title: 'Fractions Equal to or Greater than One',
      learning_outcome:
        'Represent fractions that are equal to one and greater than one using models.',
      category: 'Number Sense',
      order_index: 7,
    },
    {
      topic_code: 'G3-Q4-NA-08',
      topic_title: 'Add and Subtract Similar Fractions',
      learning_outcome:
        'Add and subtract similar fractions using models.',
      category: 'Number Sense',
      order_index: 8,
    },
    // Measurement and Geometry (MG) – Symmetry and translation
    {
      topic_code: 'G3-Q4-MG-01',
      topic_title: 'Describe Multi-Step Translations',
      learning_outcome:
        'Describe and draw the effect of a two-direction multi-step slide (or translation) in basic shapes and figures.',
      category: 'Geometry',
      order_index: 9,
    },
    {
      topic_code: 'G3-Q4-MG-02',
      topic_title: 'Identify Line Symmetry',
      learning_outcome:
        'Identify shapes or figures that show line symmetry by drawing the line of symmetry.',
      category: 'Geometry',
      order_index: 10,
    },
    {
      topic_code: 'G3-Q4-MG-03',
      topic_title: 'Complete Symmetric Figures',
      learning_outcome:
        'Complete a figure that is symmetric with respect to a line.',
      category: 'Geometry',
      order_index: 11,
    },
  ],
};

async function seedGrade3Quarters() {
  try {
    const db = await getDatabase();
    console.log('✓ Connected to database');

    // Ensure curriculum_topics has a quarter column (shared with Grades 1 and 2)
    console.log('Ensuring curriculum_topics has quarter column...');
    try {
      await dbRun(db, `ALTER TABLE curriculum_topics ADD COLUMN quarter INTEGER`);
      console.log('✓ Added quarter column');
    } catch (err) {
      if (err.message.includes('duplicate column') || err.message.includes('already exists')) {
        console.log('✓ Quarter column already exists');
      } else {
        console.error('Error adding quarter column:', err.message);
      }
    }

    // Delete existing Grade 3 topics
    console.log('Clearing existing Grade 3 topics...');
    await dbRun(db, 'DELETE FROM curriculum_topics WHERE grade = 3');

    // Insert Grade 3 quarter topics
    console.log('Seeding Grade 3 quarter topics...');
    let inserted = 0;

    for (const [quarterName, topics] of Object.entries(grade3Quarters)) {
      const quarterNum = parseInt(quarterName.replace('quarter', ''), 10);
      console.log(`\n📚 Quarter ${quarterNum}: ${topics.length} quizzes`);

      for (const topic of topics) {
        try {
          await dbRun(
            db,
            `
            INSERT INTO curriculum_topics 
            (grade, topic_code, topic_title, learning_outcome, category, order_index, quarter)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
            [
              3,
              topic.topic_code,
              topic.topic_title,
              topic.learning_outcome,
              topic.category,
              topic.order_index,
              quarterNum,
            ],
          );
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

    console.log(`\n✅ Successfully inserted ${inserted} Grade 3 topics across 4 quarters`);
    console.log(`\n📊 Summary:`);
    console.log(`   Quarter 1: ${grade3Quarters.quarter1.length} quizzes`);
    console.log(`   Quarter 2: ${grade3Quarters.quarter2.length} quizzes`);
    console.log(`   Quarter 3: ${grade3Quarters.quarter3.length} quizzes`);
    console.log(`   Quarter 4: ${grade3Quarters.quarter4.length} quizzes`);
    console.log(`   Total: ${inserted} quizzes`);

    await dbClose(db);
  } catch (error) {
    console.error('❌ Error seeding Grade 3 quarters:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedGrade3Quarters()
    .then(() => {
      console.log('\n🎉 Grade 3 quarter seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedGrade3Quarters, grade3Quarters };

