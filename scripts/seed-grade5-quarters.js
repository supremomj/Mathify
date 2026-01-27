/**
 * Grade 5 Quarter-Based Curriculum Seeder
 * Creates structured quizzes per quarter for Grade 5 students
 * Based on DepEd MATATAG Grade 5 Curriculum you provided
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

// Grade 5 Quarter Topics - aligned with the curriculum you sent
const grade5Quarters = {
  // Quarter 1 – Time, GMDAS, multiplication of fractions, area of special quadrilaterals
  quarter1: [
    // Measurement and Geometry (MG) – 12/24 hour time and world time zones
    {
      topic_code: 'G5-Q1-MG-01',
      topic_title: 'Describe 12- and 24-Hour Time',
      learning_outcome: 'Describe a 12- and 24-hour clock system.',
      category: 'Measurement',
      order_index: 1,
    },
    {
      topic_code: 'G5-Q1-MG-02',
      topic_title: 'Convert Between 12- and 24-Hour Time',
      learning_outcome: 'Convert 12-hour time to 24-hour time, and vice-versa.',
      category: 'Measurement',
      order_index: 2,
    },
    {
      topic_code: 'G5-Q1-MG-03',
      topic_title: 'Solve Problems Involving 12- and 24-Hour Time',
      learning_outcome: 'Solve problems involving 12- and 24-hour time.',
      category: 'Problem Solving',
      order_index: 3,
    },
    {
      topic_code: 'G5-Q1-MG-04',
      topic_title: 'Compare World Time Zones',
      learning_outcome:
        'Compare the time in different world time zones to the time in the Philippines using a world time zone map.',
      category: 'Measurement',
      order_index: 4,
    },
    {
      topic_code: 'G5-Q1-MG-05',
      topic_title: 'Solve Problems Involving World Time Zones',
      learning_outcome:
        'Solve problems on comparing the time in different world time zones to the time in the Philippines.',
      category: 'Problem Solving',
      order_index: 5,
    },
    // Number and Algebra (NA) – GMDAS and multiplication of fractions
    {
      topic_code: 'G5-Q1-NA-01',
      topic_title: 'Apply GMDAS with Three or More Operations',
      learning_outcome: 'Perform three or more different operations by applying the GMDAS rules.',
      category: 'Operations',
      order_index: 6,
    },
    {
      topic_code: 'G5-Q1-NA-02',
      topic_title: 'Multiply Fractions Using Models',
      learning_outcome: 'Multiply fractions using models.',
      category: 'Fractions',
      order_index: 7,
    },
    {
      topic_code: 'G5-Q1-NA-03',
      topic_title: 'Multiply a Fraction by a Fraction',
      learning_outcome: 'Multiply a fraction by a fraction.',
      category: 'Fractions',
      order_index: 8,
    },
    {
      topic_code: 'G5-Q1-NA-04',
      topic_title: 'Solve Word Problems Involving Multiplication of Fractions',
      learning_outcome:
        'Solve multi-step problems involving multiplication of fractions that may or may not also involve addition or subtraction of fractions.',
      category: 'Problem Solving',
      order_index: 9,
    },
    // Measurement and Geometry (MG) – Area of parallelogram, triangle, trapezoid
    {
      topic_code: 'G5-Q1-MG-06',
      topic_title: 'Identify Heights of Parallelograms, Triangles, and Trapezoids',
      learning_outcome:
        'Identify the height of a parallelogram, triangle, and trapezoid, in different orientations.',
      category: 'Geometry',
      order_index: 10,
    },
    {
      topic_code: 'G5-Q1-MG-07',
      topic_title: 'Find Area of Parallelograms, Triangles, and Trapezoids',
      learning_outcome:
        'Find the area of a parallelogram, triangle, and trapezoid, in sq. cm or sq. m, using formulas.',
      category: 'Measurement',
      order_index: 11,
    },
    {
      topic_code: 'G5-Q1-MG-08',
      topic_title: 'Estimate Areas Using Grids',
      learning_outcome:
        'Estimate the areas of triangles and quadrilaterals (parallelogram, rhombus, trapezoid) using grids.',
      category: 'Measurement',
      order_index: 12,
    },
  ],

  // Quarter 2 – Division of fractions, decimals to thousandths, divisibility, primes/composites
  quarter2: [
    // Number and Algebra (NA) – Division of fractions
    {
      topic_code: 'G5-Q2-NA-01',
      topic_title: 'Divide Fractions Using Models',
      learning_outcome: 'Divide fractions using models.',
      category: 'Fractions',
      order_index: 1,
    },
    {
      topic_code: 'G5-Q2-NA-02',
      topic_title: 'Divide a Fraction by a Fraction',
      learning_outcome: 'Divide a fraction by a fraction.',
      category: 'Fractions',
      order_index: 2,
    },
    {
      topic_code: 'G5-Q2-NA-03',
      topic_title: 'Solve Word Problems Involving Division of Fractions',
      learning_outcome:
        'Solve multi-step problems involving division of fractions that may or may not involve the other operations with fractions.',
      category: 'Problem Solving',
      order_index: 3,
    },
    // Decimals to thousandths
    {
      topic_code: 'G5-Q2-NA-04',
      topic_title: 'Place Value of Decimals to Thousandths',
      learning_outcome:
        'Determine the place value to thousandths of a digit in a given decimal number, the value of a digit, and the digit of a number, given its place value.',
      category: 'Number Sense',
      order_index: 4,
    },
    {
      topic_code: 'G5-Q2-NA-05',
      topic_title: 'Read and Write Decimals to Thousandths',
      learning_outcome: 'Read and write decimal numbers with decimal parts to thousandths.',
      category: 'Number Sense',
      order_index: 5,
    },
    {
      topic_code: 'G5-Q2-NA-06',
      topic_title: 'Convert Between Terminating Decimals and Fractions',
      learning_outcome: 'Convert terminating decimals to fractions, and vice versa.',
      category: 'Fractions',
      order_index: 6,
    },
    {
      topic_code: 'G5-Q2-NA-07',
      topic_title: 'Compare and Order Decimals to Thousandths',
      learning_outcome: 'Compare and order decimal numbers with decimal parts to thousandths.',
      category: 'Number Sense',
      order_index: 7,
    },
    {
      topic_code: 'G5-Q2-NA-08',
      topic_title: 'Round Decimals to the Nearest Thousandth',
      learning_outcome: 'Round decimal numbers to the nearest thousandths.',
      category: 'Number Sense',
      order_index: 8,
    },
    {
      topic_code: 'G5-Q2-NA-09',
      topic_title: 'Add and Subtract Decimals',
      learning_outcome:
        'Add and subtract decimal numbers with decimal parts of up to 3 decimal places.',
      category: 'Operations',
      order_index: 9,
    },
    {
      topic_code: 'G5-Q2-NA-10',
      topic_title: 'Solve Word Problems Involving Decimals',
      learning_outcome:
        'Solve multi-step problems involving addition and/or subtraction of decimals, including problems involving money.',
      category: 'Problem Solving',
      order_index: 10,
    },
    // Divisibility rules, prime and composite
    {
      topic_code: 'G5-Q2-NA-11',
      topic_title: 'Use Divisibility Rules for 2, 5, and 10',
      learning_outcome: 'Use divisibility rules for 2, 5, and 10 to find common factors of numbers.',
      category: 'Number Sense',
      order_index: 11,
    },
    {
      topic_code: 'G5-Q2-NA-12',
      topic_title: 'Use Divisibility Rules for 3, 6, and 9',
      learning_outcome: 'Use divisibility rules for 3, 6, and 9 to find common factors of numbers.',
      category: 'Number Sense',
      order_index: 12,
    },
    {
      topic_code: 'G5-Q2-NA-13',
      topic_title: 'Use Divisibility Rules for 4, 8, 11, and 12',
      learning_outcome: 'Use divisibility rules for 4, 8, 11, and 12 to find common factors of numbers.',
      category: 'Number Sense',
      order_index: 13,
    },
    {
      topic_code: 'G5-Q2-NA-14',
      topic_title: 'Distinguish Prime and Composite Numbers',
      learning_outcome:
        'Distinguish prime numbers from composite numbers using the Sieve of Eratosthenes.',
      category: 'Number Sense',
      order_index: 14,
    },
  ],

  // Quarter 3 – Double bar/line graphs, probability, multiplication and division of decimals
  quarter3: [
    // Data and Probability (DP) – Double bar/line graphs, theoretical probability
    {
      topic_code: 'G5-Q3-DP-01',
      topic_title: 'Collect Bivariate Data',
      learning_outcome:
        'Collects bivariate data from interview, questionnaire, and other appropriate sources.',
      category: 'Data',
      order_index: 1,
    },
    {
      topic_code: 'G5-Q3-DP-02',
      topic_title: 'Choose Appropriate Graphs for Data',
      learning_outcome:
        'Identify the appropriate graph (bar graph or line graph) to represent a given set of data.',
      category: 'Data',
      order_index: 2,
    },
    {
      topic_code: 'G5-Q3-DP-03',
      topic_title: 'Construct Double Bar and Double Line Graphs',
      learning_outcome: 'Construct double bar graphs and double line graphs.',
      category: 'Data',
      order_index: 3,
    },
    {
      topic_code: 'G5-Q3-DP-04',
      topic_title: 'Interpret Double Bar and Double Line Graphs',
      learning_outcome:
        'Interpret data presented in a double bar graph or a double line graph.',
      category: 'Data',
      order_index: 4,
    },
    {
      topic_code: 'G5-Q3-DP-05',
      topic_title: 'Draw Conclusions from Double Graphs',
      learning_outcome:
        'Draw conclusions or make inferences based on data presented in a double bar graph or a double line graph.',
      category: 'Problem Solving',
      order_index: 5,
    },
    {
      topic_code: 'G5-Q3-DP-06',
      topic_title: 'Solve Problems Using Double Graphs',
      learning_outcome:
        'Solve problems using data presented in a double bar graph or a double line graph.',
      category: 'Problem Solving',
      order_index: 6,
    },
    {
      topic_code: 'G5-Q3-DP-07',
      topic_title: 'Describe Probability of Events',
      learning_outcome: 'Describe probability as a measure of the chance of an event occurring.',
      category: 'Probability',
      order_index: 7,
    },
    {
      topic_code: 'G5-Q3-DP-08',
      topic_title: 'Calculate Theoretical Probability of Simple Events',
      learning_outcome:
        'Calculate the theoretical probability of a simple event by listing all possible outcomes.',
      category: 'Probability',
      order_index: 8,
    },
    // Number and Algebra (NA) – Multiplication and division of decimal numbers
    {
      topic_code: 'G5-Q3-NA-01',
      topic_title: 'Estimate Products of Decimals',
      learning_outcome:
        'Estimate each of two decimal numbers to the nearest whole number to estimate their product.',
      category: 'Operations',
      order_index: 9,
    },
    {
      topic_code: 'G5-Q3-NA-02',
      topic_title: 'Multiply Decimal Numbers',
      learning_outcome:
        'Multiply decimal numbers with decimal parts of up to 2 decimal places.',
      category: 'Operations',
      order_index: 10,
    },
    {
      topic_code: 'G5-Q3-NA-03',
      topic_title: 'Solve Word Problems Involving Multiplication of Decimals',
      learning_outcome:
        'Solve multi-step problems involving multiplication of decimals that may or may not also involve addition or subtraction of decimals, including problems involving money.',
      category: 'Problem Solving',
      order_index: 11,
    },
    {
      topic_code: 'G5-Q3-NA-04',
      topic_title: 'Estimate Quotients of Decimals',
      learning_outcome:
        'Estimate the quotient when dividing two decimal numbers by estimating the dividend and divisor to the nearest whole number.',
      category: 'Operations',
      order_index: 12,
    },
    {
      topic_code: 'G5-Q3-NA-05',
      topic_title: 'Divide Whole Numbers to Get Decimal Quotients',
      learning_outcome:
        'Divide 1- to 2-digit whole numbers resulting in a terminating decimal quotient (e.g., 4 ÷ 5 = 0.8).',
      category: 'Operations',
      order_index: 13,
    },
    {
      topic_code: 'G5-Q3-NA-06',
      topic_title: 'Divide Decimals by Whole Numbers',
      learning_outcome:
        'Divide a decimal of up to 2 decimal places by a 1- to 2-digit whole number, resulting in a terminating decimal quotient of up to 3 decimal places.',
      category: 'Operations',
      order_index: 14,
    },
  ],

  // Quarter 4 – GMDAS with fractions/decimals, solids, surface area, volume, rotation
  quarter4: [
    // Number and Algebra (NA) – GMDAS with fractions and decimals
    {
      topic_code: 'G5-Q4-NA-01',
      topic_title: 'Solve Word Problems Involving Division of Decimals',
      learning_outcome:
        'Solve multi-step problems involving division of decimals that may or may not also involve the other operations with decimals, including problems involving money.',
      category: 'Problem Solving',
      order_index: 1,
    },
    {
      topic_code: 'G5-Q4-NA-02',
      topic_title: 'Apply GMDAS with Fractions and Decimals',
      learning_outcome:
        'Perform three or more different operations with fractions and decimals by applying the GMDAS rules.',
      category: 'Operations',
      order_index: 2,
    },
    // Measurement and Geometry (MG) – Solid figures, surface area, volume, rotation
    {
      topic_code: 'G5-Q4-MG-01',
      topic_title: 'Illustrate Solid Figures Using Models',
      learning_outcome:
        'Illustrate different solid figures using concrete and pictorial models.',
      category: 'Geometry',
      order_index: 3,
    },
    {
      topic_code: 'G5-Q4-MG-02',
      topic_title: 'Relate Plane Figures to Solid Figures',
      learning_outcome:
        'Relate plane figures to solid figures using concrete and pictorial models.',
      category: 'Geometry',
      order_index: 4,
    },
    {
      topic_code: 'G5-Q4-MG-03',
      topic_title: 'Describe Prisms and Pyramids',
      learning_outcome:
        'Describe and differentiate prisms and pyramids using their vertices, faces, and/or edges.',
      category: 'Geometry',
      order_index: 5,
    },
    {
      topic_code: 'G5-Q4-MG-04',
      topic_title: 'Illustrate Nets of Solid Figures',
      learning_outcome: 'Illustrate and describe solid figures and their nets.',
      category: 'Geometry',
      order_index: 6,
    },
    {
      topic_code: 'G5-Q4-MG-05',
      topic_title: 'Make Models of Solid Figures',
      learning_outcome: 'Make models of solid figures.',
      category: 'Geometry',
      order_index: 7,
    },
    {
      topic_code: 'G5-Q4-MG-06',
      topic_title: 'Find Surface Area of Solid Figures',
      learning_outcome: 'Illustrate and find the surface area of solid figures.',
      category: 'Measurement',
      order_index: 8,
    },
    {
      topic_code: 'G5-Q4-MG-07',
      topic_title: 'Solve Word Problems Involving Surface Area',
      learning_outcome: 'Solve problems involving the surface area of solid figures.',
      category: 'Problem Solving',
      order_index: 9,
    },
    {
      topic_code: 'G5-Q4-MG-08',
      topic_title: 'Distinguish Cubes and Rectangular Prisms',
      learning_outcome: 'Describe and distinguish cubes and rectangular prisms.',
      category: 'Geometry',
      order_index: 10,
    },
    {
      topic_code: 'G5-Q4-MG-09',
      topic_title: 'Estimate Volume of Cubes and Rectangular Prisms',
      learning_outcome:
        'Estimate the volume of a cube and of a rectangular prism using non-standard units of measurement.',
      category: 'Measurement',
      order_index: 11,
    },
    {
      topic_code: 'G5-Q4-MG-10',
      topic_title: 'Draw Rotations of Figures',
      learning_outcome:
        'Draw the image of an object after applying rotation about a point given an angle of rotation, clockwise or counterclockwise.',
      category: 'Geometry',
      order_index: 12,
    },
  ],
};

async function seedGrade5Quarters() {
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

    // Delete existing Grade 5 topics
    console.log('Clearing existing Grade 5 topics...');
    await dbRun(db, 'DELETE FROM curriculum_topics WHERE grade = 5');

    // Insert Grade 5 quarter topics
    console.log('Seeding Grade 5 quarter topics...');
    let inserted = 0;

    for (const [quarterName, topics] of Object.entries(grade5Quarters)) {
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
              5,
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

    console.log(`\n✅ Successfully inserted ${inserted} Grade 5 topics across 4 quarters`);
    console.log(`\n📊 Summary:`);
    console.log(`   Quarter 1: ${grade5Quarters.quarter1.length} quizzes`);
    console.log(`   Quarter 2: ${grade5Quarters.quarter2.length} quizzes`);
    console.log(`   Quarter 3: ${grade5Quarters.quarter3.length} quizzes`);
    console.log(`   Quarter 4: ${grade5Quarters.quarter4.length} quizzes`);
    console.log(`   Total: ${inserted} quizzes`);

    await dbClose(db);
  } catch (error) {
    console.error('❌ Error seeding Grade 5 quarters:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedGrade5Quarters()
    .then(() => {
      console.log('\n🎉 Grade 5 quarter seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedGrade5Quarters, grade5Quarters };

