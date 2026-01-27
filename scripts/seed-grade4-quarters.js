/**
 * Grade 4 Quarter-Based Curriculum Seeder
 * Creates structured quizzes per quarter for Grade 4 students
 * Based on DepEd MATATAG Grade 4 Curriculum you provided
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

// Grade 4 Quarter Topics - aligned with the curriculum you sent
const grade4Quarters = {
  // Quarter 1 – Angles, triangles/quadrilaterals, perimeter, large whole numbers
  quarter1: [
    // Measurement and Geometry (MG) – Angles, triangles, quadrilaterals, perimeters
    {
      topic_code: 'G4-Q1-MG-01',
      topic_title: 'Illustrate Right, Acute, and Obtuse Angles',
      learning_outcome:
        'Illustrate different angles (right, acute, and obtuse) using models.',
      category: 'Geometry',
      order_index: 1,
    },
    {
      topic_code: 'G4-Q1-MG-02',
      topic_title: 'Measure and Draw Angles with a Protractor',
      learning_outcome:
        'Measure and draw angles using a protractor.',
      category: 'Geometry',
      order_index: 2,
    },
    {
      topic_code: 'G4-Q1-MG-03',
      topic_title: 'Properties of Triangles and Quadrilaterals',
      learning_outcome:
        'Draw and state the properties of triangles and quadrilaterals.',
      category: 'Geometry',
      order_index: 3,
    },
    {
      topic_code: 'G4-Q1-MG-04',
      topic_title: 'Classify Triangles and Quadrilaterals',
      learning_outcome:
        'Classify triangles and quadrilaterals according to sides and angles.',
      category: 'Geometry',
      order_index: 4,
    },
    {
      topic_code: 'G4-Q1-MG-05',
      topic_title: 'Differentiate Quadrilaterals',
      learning_outcome:
        'Differentiate different quadrilaterals.',
      category: 'Geometry',
      order_index: 5,
    },
    {
      topic_code: 'G4-Q1-MG-06',
      topic_title: 'Perimeter of Quadrilaterals',
      learning_outcome:
        'Find the perimeter of quadrilaterals that are not squares or rectangles.',
      category: 'Geometry',
      order_index: 6,
    },
    {
      topic_code: 'G4-Q1-MG-07',
      topic_title: 'Perimeter of Composite Figures',
      learning_outcome:
        'Find the perimeter of composite figures composed of triangles and quadrilaterals.',
      category: 'Geometry',
      order_index: 7,
    },
    // Number and Algebra (NA) – Whole numbers up to 1 000 000; addition/subtraction
    {
      topic_code: 'G4-Q1-NA-01',
      topic_title: 'Read and Write Numbers up to 1 000 000',
      learning_outcome:
        'Read and write numbers up to 1 000 000 in numerals and in words.',
      category: 'Number Sense',
      order_index: 8,
    },
    {
      topic_code: 'G4-Q1-NA-02',
      topic_title: 'Place Value in 6-Digit Numbers',
      learning_outcome:
        'Determine the place value of a digit in a 6-digit number, the value of a digit, and the digit of a number given its place value.',
      category: 'Number Sense',
      order_index: 9,
    },
    {
      topic_code: 'G4-Q1-NA-03',
      topic_title: 'Compare Numbers up to 1 000 000',
      learning_outcome:
        'Compare numbers up to 1 000 000 using =, <, and >.',
      category: 'Number Sense',
      order_index: 10,
    },
    {
      topic_code: 'G4-Q1-NA-04',
      topic_title: 'Round Numbers to the Nearest Hundred Thousand',
      learning_outcome:
        'Round numbers to the nearest hundred thousand.',
      category: 'Number Sense',
      order_index: 11,
    },
    {
      topic_code: 'G4-Q1-NA-05',
      topic_title: 'Estimate Sums and Differences of Large Numbers',
      learning_outcome:
        'Estimate the sum and difference of two 5- to 6-digit numbers by rounding the addends to the nearest large place value of the numbers.',
      category: 'Operations',
      order_index: 12,
    },
    {
      topic_code: 'G4-Q1-NA-06',
      topic_title: 'Add and Subtract Numbers up to 1 000 000',
      learning_outcome:
        'Add numbers with sums up to 1 000 000 and subtract numbers where both numbers are less than 1 000 000, with and without regrouping.',
      category: 'Operations',
      order_index: 13,
    },
  ],

  // Quarter 2 – Multiplication, division, MDAS, unit conversions, similar fractions
  quarter2: [
    // Number and Algebra (NA) – Multiplication, division, MDAS
    {
      topic_code: 'G4-Q2-NA-01',
      topic_title: 'Multiply up to 4-Digit Numbers',
      learning_outcome:
        'Multiply two numbers with and without regrouping: 3- to 4-digit numbers by a 1-digit number, and 2- to 3-digit numbers by 2-digit numbers, with products up to 1 000 000.',
      category: 'Operations',
      order_index: 1,
    },
    {
      topic_code: 'G4-Q2-NA-02',
      topic_title: 'Estimate Products up to 1 000 000',
      learning_outcome:
        'Estimate the result of multiplying two numbers where the product is less than 1 000 000.',
      category: 'Operations',
      order_index: 2,
    },
    {
      topic_code: 'G4-Q2-NA-03',
      topic_title: 'Solve Multi-Step Problems with the Four Operations',
      learning_outcome:
        'Solve multi-step problems involving one or more of the four operations with results of calculations up to 1 000 000, including problems involving money.',
      category: 'Problem Solving',
      order_index: 3,
    },
    {
      topic_code: 'G4-Q2-NA-04',
      topic_title: 'Divide up to 4-Digit Numbers',
      learning_outcome:
        'Divide two numbers with and without regrouping: 3- to 4-digit numbers by 1-digit numbers, and 2- to 3-digit numbers by 2-digit numbers.',
      category: 'Operations',
      order_index: 4,
    },
    {
      topic_code: 'G4-Q2-NA-05',
      topic_title: 'Estimate Quotients by Rounding',
      learning_outcome:
        'Estimate the quotient when dividing 3- to 4-digit dividends by 1- to 2-digit divisors by first estimating the dividends and divisors using multiples of 10.',
      category: 'Operations',
      order_index: 5,
    },
    {
      topic_code: 'G4-Q2-NA-06',
      topic_title: 'Model Situations with Number Sentences',
      learning_outcome:
        'Represent situations involving one or more of the four operations using a number sentence.',
      category: 'Operations',
      order_index: 6,
    },
    {
      topic_code: 'G4-Q2-NA-07',
      topic_title: 'Apply MDAS Rules',
      learning_outcome:
        'Perform two or more different operations by applying the MDAS rules.',
      category: 'Operations',
      order_index: 7,
    },
    // Measurement and Geometry (MG) – Unit conversion
    {
      topic_code: 'G4-Q2-MG-01',
      topic_title: 'Convert Units of Length, Mass, and Capacity',
      learning_outcome:
        'Convert common units of measure from larger to smaller units, and vice versa: meter and centimeter, kilometer and meter, kilogram and gram, gram and milligram, and liter and milliliter.',
      category: 'Measurement',
      order_index: 8,
    },
    {
      topic_code: 'G4-Q2-MG-02',
      topic_title: 'Convert Units of Time',
      learning_outcome:
        'Convert time measures from smaller to larger units, and vice versa: seconds to minutes, minutes to hours, hours to days, days to weeks, weeks to months, and months to years.',
      category: 'Measurement',
      order_index: 9,
    },
    {
      topic_code: 'G4-Q2-MG-03',
      topic_title: 'Solve Problems Involving Unit Conversion and Elapsed Time',
      learning_outcome:
        'Solve problems involving conversion of units of length, mass, capacity, and time, including problems involving elapsed time in hours and minutes.',
      category: 'Problem Solving',
      order_index: 10,
    },
    // Number and Algebra (NA) – Similar fractions and mixed numbers
    {
      topic_code: 'G4-Q2-NA-08',
      topic_title: 'Identify Types of Fractions',
      learning_outcome:
        'Identify proper fractions, improper fractions, and mixed numbers.',
      category: 'Number Sense',
      order_index: 11,
    },
    {
      topic_code: 'G4-Q2-NA-09',
      topic_title: 'Rewrite Improper Fractions and Mixed Numbers',
      learning_outcome:
        'Rewrite improper fractions into mixed numbers, and vice versa.',
      category: 'Number Sense',
      order_index: 12,
    },
    {
      topic_code: 'G4-Q2-NA-10',
      topic_title: 'Plot Fractions on the Number Line',
      learning_outcome:
        'Plot fractions (proper fractions, improper fractions, and mixed numbers) with denominators 2, 4, 5, and 10 on the number line.',
      category: 'Number Sense',
      order_index: 13,
    },
    {
      topic_code: 'G4-Q2-NA-11',
      topic_title: 'Add and Subtract Similar Fractions and Mixed Numbers',
      learning_outcome:
        'Add and subtract similar fractions: two proper fractions, two mixed numbers, a mixed number and a proper fraction, a whole number and a proper fraction, and a whole number and a mixed number.',
      category: 'Operations',
      order_index: 14,
    },
  ],

  // Quarter 3 – Dissimilar fractions, factors/multiples, symmetry and reflection
  quarter3: [
    // Number and Algebra (NA) – Dissimilar and equivalent fractions, factors/multiples
    {
      topic_code: 'G4-Q3-NA-01',
      topic_title: 'Represent Dissimilar Fractions',
      learning_outcome:
        'Represent dissimilar fractions, with denominators up to 10, using models.',
      category: 'Number Sense',
      order_index: 1,
    },
    {
      topic_code: 'G4-Q3-NA-02',
      topic_title: 'Compare and Order Dissimilar Fractions',
      learning_outcome:
        'Compare dissimilar fractions using the symbols =, >, and <, and order dissimilar fractions from smallest to largest, and vice versa.',
      category: 'Number Sense',
      order_index: 2,
    },
    {
      topic_code: 'G4-Q3-NA-03',
      topic_title: 'Generate and Determine Equivalent Fractions',
      learning_outcome:
        'Generate equivalent fractions using models and determine equivalent fractions.',
      category: 'Number Sense',
      order_index: 3,
    },
    {
      topic_code: 'G4-Q3-NA-04',
      topic_title: 'Multiples up to 100',
      learning_outcome:
        'Identify the multiples of given numbers up to 100.',
      category: 'Number Sense',
      order_index: 4,
    },
    {
      topic_code: 'G4-Q3-NA-05',
      topic_title: 'Factors up to 100',
      learning_outcome:
        'Find all the factors of a given number up to 100.',
      category: 'Number Sense',
      order_index: 5,
    },
    {
      topic_code: 'G4-Q3-NA-06',
      topic_title: 'Fractions in Simplest Form',
      learning_outcome:
        'Reduce fractions to simplest form.',
      category: 'Number Sense',
      order_index: 6,
    },
    {
      topic_code: 'G4-Q3-NA-07',
      topic_title: 'Add and Subtract Dissimilar Fractions',
      learning_outcome:
        'Add and subtract dissimilar fractions using models and in symbolic form for: two proper fractions, two mixed numbers, a mixed number and a proper fraction, a whole number and a proper fraction, and a whole number and a mixed number.',
      category: 'Operations',
      order_index: 7,
    },
    {
      topic_code: 'G4-Q3-NA-08',
      topic_title: 'Solve Word Problems with Fractions',
      learning_outcome:
        'Solve multi-step problems involving addition and/or subtraction of fractions.',
      category: 'Problem Solving',
      order_index: 8,
    },
    // Measurement and Geometry (MG) – Symmetry and reflection
    {
      topic_code: 'G4-Q3-MG-01',
      topic_title: 'Identify Line Symmetry',
      learning_outcome:
        'Identify symmetry with respect to a line.',
      category: 'Geometry',
      order_index: 9,
    },
    {
      topic_code: 'G4-Q3-MG-02',
      topic_title: 'Complete Symmetric Figures',
      learning_outcome:
        'Complete a figure that is symmetric with respect to a line.',
      category: 'Geometry',
      order_index: 10,
    },
    {
      topic_code: 'G4-Q3-MG-03',
      topic_title: 'Draw Reflections and Glide Reflections',
      learning_outcome:
        'Draw the image of an object after applying reflection with respect to a line, including glide reflection.',
      category: 'Geometry',
      order_index: 11,
    },
  ],

  // Quarter 4 – Data (line graphs), patterns, number sentences, decimals
  quarter4: [
    // Data and Probability (DP) – Line graphs with time element
    {
      topic_code: 'G4-Q4-DP-01',
      topic_title: 'Collect Data with Time Element',
      learning_outcome:
        'Collect data with time element using appropriate sources.',
      category: 'Data',
      order_index: 1,
    },
    {
      topic_code: 'G4-Q4-DP-02',
      topic_title: 'Present Data in Tables and Line Graphs',
      learning_outcome:
        'Present data in a tabular form, or in a single line graph.',
      category: 'Data',
      order_index: 2,
    },
    {
      topic_code: 'G4-Q4-DP-03',
      topic_title: 'Interpret Tables and Line Graphs',
      learning_outcome:
        'Interpret data presented in a tabular form, or in a single line graph.',
      category: 'Data',
      order_index: 3,
    },
    {
      topic_code: 'G4-Q4-DP-04',
      topic_title: 'Solve Problems Using Tables and Line Graphs',
      learning_outcome:
        'Solve problems using data for at most two variables in a tabular form, or in a single line graph.',
      category: 'Problem Solving',
      order_index: 4,
    },
    // Number and Algebra (NA) – Patterns, number sentences, decimals and fractions
    {
      topic_code: 'G4-Q4-NA-01',
      topic_title: 'Describe Rules of Simple Patterns',
      learning_outcome:
        'Describe the rule used to generate a given simple pattern.',
      category: 'Patterns',
      order_index: 5,
    },
    {
      topic_code: 'G4-Q4-NA-02',
      topic_title: 'Complete Number Sentences for Properties and Facts',
      learning_outcome:
        'Complete a number sentence to represent a property of operations (e.g., commutative property of addition) or to represent equivalent number facts.',
      category: 'Operations',
      order_index: 6,
    },
    {
      topic_code: 'G4-Q4-NA-03',
      topic_title: 'Represent Decimals and Their Relationship to Fractions',
      learning_outcome:
        'Represent decimal numbers using models and manipulatives to show the relationship to fractions.',
      category: 'Number Sense',
      order_index: 7,
    },
    {
      topic_code: 'G4-Q4-NA-04',
      topic_title: 'Read and Write Decimals to Hundredths',
      learning_outcome:
        'Read and write decimal numbers with decimal parts to hundredths.',
      category: 'Number Sense',
      order_index: 8,
    },
    {
      topic_code: 'G4-Q4-NA-05',
      topic_title: 'Place Value of Decimals to Hundredths',
      learning_outcome:
        'Determine the place value to hundredths of a digit in a given decimal number, the value of a digit, and the digit of a number, given its place value.',
      category: 'Number Sense',
      order_index: 9,
    },
    {
      topic_code: 'G4-Q4-NA-06',
      topic_title: 'Convert Between Decimals and Fractions',
      learning_outcome:
        'Convert decimal numbers to fractions, and fractions with denominators 10 or 100 to decimals.',
      category: 'Number Sense',
      order_index: 10,
    },
    {
      topic_code: 'G4-Q4-NA-07',
      topic_title: 'Plot Decimals on the Number Line',
      learning_outcome:
        'Plot decimal numbers with tenth decimal part on the number line.',
      category: 'Number Sense',
      order_index: 11,
    },
    {
      topic_code: 'G4-Q4-NA-08',
      topic_title: 'Compare and Order Decimals',
      learning_outcome:
        'Compare and order decimal numbers with decimal parts to hundredths.',
      category: 'Number Sense',
      order_index: 12,
    },
    {
      topic_code: 'G4-Q4-NA-09',
      topic_title: 'Round Decimals',
      learning_outcome:
        'Round decimal numbers to the nearest whole number and to the nearest tenth.',
      category: 'Number Sense',
      order_index: 13,
    },
  ],
};

async function seedGrade4Quarters() {
  try {
    const db = await getDatabase();
    console.log('✓ Connected to database');

    // Ensure curriculum_topics has a quarter column (shared with other grades)
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

    // Delete existing Grade 4 topics
    console.log('Clearing existing Grade 4 topics...');
    await dbRun(db, 'DELETE FROM curriculum_topics WHERE grade = 4');

    // Insert Grade 4 quarter topics
    console.log('Seeding Grade 4 quarter topics...');
    let inserted = 0;

    for (const [quarterName, topics] of Object.entries(grade4Quarters)) {
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
              4,
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

    console.log(`\n✅ Successfully inserted ${inserted} Grade 4 topics across 4 quarters`);
    console.log(`\n📊 Summary:`);
    console.log(`   Quarter 1: ${grade4Quarters.quarter1.length} quizzes`);
    console.log(`   Quarter 2: ${grade4Quarters.quarter2.length} quizzes`);
    console.log(`   Quarter 3: ${grade4Quarters.quarter3.length} quizzes`);
    console.log(`   Quarter 4: ${grade4Quarters.quarter4.length} quizzes`);
    console.log(`   Total: ${inserted} quizzes`);

    await dbClose(db);
  } catch (error) {
    console.error('❌ Error seeding Grade 4 quarters:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedGrade4Quarters()
    .then(() => {
      console.log('\n🎉 Grade 4 quarter seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedGrade4Quarters, grade4Quarters };

