/**
 * Grade 6 Quarter-Based Curriculum Seeder
 * Creates structured quizzes per quarter for Grade 6 students
 * Based on DepEd MATATAG Grade 6 Curriculum you provided
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

// Grade 6 Quarter Topics - aligned with the curriculum you sent
const grade6Quarters = {
  // Quarter 1 – Tessellation & transformations, operations with decimals & fractions
  quarter1: [
    // Measurement and Geometry (MG) – Tessellation and transformations
    {
      topic_code: 'G6-Q1-MG-01',
      topic_title: 'Explore Tessellating Shapes',
      learning_outcome: 'Explore whether or not a shape tessellates.',
      category: 'Geometry',
      order_index: 1,
    },
    {
      topic_code: 'G6-Q1-MG-02',
      topic_title: 'Tessellate Surfaces with Shapes',
      learning_outcome:
        'Tessellate a surface using different shapes, including triangles, squares, and rectangles.',
      category: 'Geometry',
      order_index: 2,
    },
    {
      topic_code: 'G6-Q1-MG-03',
      topic_title: 'Draw Translations, Reflections, and Rotations of Shapes',
      learning_outcome:
        'Draw resulting images of shapes that undergo translation, reflection, and rotation.',
      category: 'Geometry',
      order_index: 3,
    },
    // Number and Algebra (NA) – Four operations with decimals
    {
      topic_code: 'G6-Q1-NA-01',
      topic_title: 'Add and Subtract Decimals to Four Decimal Places',
      learning_outcome:
        'Add and subtract decimals with decimal parts of up to 4 decimal places.',
      category: 'Operations',
      order_index: 4,
    },
    {
      topic_code: 'G6-Q1-NA-02',
      topic_title: 'Solve Problems Involving Addition and Subtraction of Decimals',
      learning_outcome:
        'Solve multi-step problems involving addition and/or subtraction of decimals, including problems involving money.',
      category: 'Problem Solving',
      order_index: 5,
    },
    {
      topic_code: 'G6-Q1-NA-03',
      topic_title: 'Mentally Multiply Decimals by Powers of 10 and Their Reciprocals',
      learning_outcome:
        'Mentally multiply decimals of up to 2 decimal places by 0.1, 0.01, 0.001, 10, 100, and 1000.',
      category: 'Operations',
      order_index: 6,
    },
    {
      topic_code: 'G6-Q1-NA-04',
      topic_title: 'Solve Problems Involving Multiplication of Decimals',
      learning_outcome:
        'Solve multi-step problems involving multiplication of decimals that may or may not also involve addition or subtraction of decimals, including problems involving money.',
      category: 'Problem Solving',
      order_index: 7,
    },
    {
      topic_code: 'G6-Q1-NA-05',
      topic_title: 'Divide to Obtain Repeating Decimal Quotients',
      learning_outcome:
        'Divide 1- to 2-digit whole numbers resulting in a repeating (non-terminating) decimal quotient, and divide a whole number by a decimal of 1 decimal place.',
      category: 'Operations',
      order_index: 8,
    },
    {
      topic_code: 'G6-Q1-NA-06',
      topic_title: 'Mentally Divide Decimals by Powers of 10 and Their Reciprocals',
      learning_outcome:
        'Mentally divide decimals of up to 4 decimal places by 0.1, 0.01, and 0.001, and decimals of up to 2 decimal places by 10, 100, and 1000.',
      category: 'Operations',
      order_index: 9,
    },
    {
      topic_code: 'G6-Q1-NA-07',
      topic_title: 'Solve Problems Involving Division of Decimals',
      learning_outcome:
        'Solve problems involving division of decimals that may or may not involve the other operations with decimals and/or whole numbers.',
      category: 'Problem Solving',
      order_index: 10,
    },
    // Number and Algebra (NA) – Four operations with fractions, whole numbers, mixed numbers
    {
      topic_code: 'G6-Q1-NA-08',
      topic_title: 'Multiply Fractions, Whole Numbers, and Mixed Numbers',
      learning_outcome:
        'Obtain products that result from multiplying different combinations of fractions, whole numbers, and mixed numbers.',
      category: 'Fractions',
      order_index: 11,
    },
    {
      topic_code: 'G6-Q1-NA-09',
      topic_title:
        'Solve Problems Involving Multiplication of Fractions, Whole Numbers, and Mixed Numbers',
      learning_outcome:
        'Solve multi-step problems involving multiplication that may or may not involve addition or subtraction of different combinations of fractions, whole numbers, and mixed numbers.',
      category: 'Problem Solving',
      order_index: 12,
    },
    {
      topic_code: 'G6-Q1-NA-10',
      topic_title: 'Divide Fractions, Whole Numbers, and Mixed Numbers',
      learning_outcome:
        'Divide different combinations of fractions, whole numbers, and mixed numbers.',
      category: 'Fractions',
      order_index: 13,
    },
    {
      topic_code: 'G6-Q1-NA-11',
      topic_title:
        'Solve Problems Involving Division of Fractions, Whole Numbers, and Mixed Numbers',
      learning_outcome:
        'Solve multi-step problems involving division of different combinations of fractions, whole numbers, and mixed numbers that may or may not involve any of the other operations of fractions.',
      category: 'Problem Solving',
      order_index: 14,
    },
  ],

  // Quarter 2 – Ratio & proportion, percentages, exponents and GEMDAS
  quarter2: [
    // Number and Algebra (NA) – Ratio and proportion
    {
      topic_code: 'G6-Q2-NA-01',
      topic_title: 'Describe Ratios in Part-Whole and Part-Part Situations',
      learning_outcome:
        'Describe the relationship between quantities using ratio for part-whole and part-part relationships.',
      category: 'Ratio and Proportion',
      order_index: 1,
    },
    {
      topic_code: 'G6-Q2-NA-02',
      topic_title: 'Express One Number as a Fraction of Another Using Ratios',
      learning_outcome:
        'Express one number as a fraction of another given their ratio, and vice versa.',
      category: 'Ratio and Proportion',
      order_index: 2,
    },
    {
      topic_code: 'G6-Q2-NA-03',
      topic_title: 'Identify and Write Equivalent Ratios',
      learning_outcome: 'Identify and write equivalent ratios.',
      category: 'Ratio and Proportion',
      order_index: 3,
    },
    {
      topic_code: 'G6-Q2-NA-04',
      topic_title: 'Solve Word Problems Involving Ratio',
      learning_outcome: 'Solve problems involving ratio.',
      category: 'Problem Solving',
      order_index: 4,
    },
    {
      topic_code: 'G6-Q2-NA-05',
      topic_title: 'Model Ratio and Proportion with Tables and Double Number Lines',
      learning_outcome:
        'Illustrate ratio and proportion in given situations using tables and/or the double number line model.',
      category: 'Ratio and Proportion',
      order_index: 5,
    },
    {
      topic_code: 'G6-Q2-NA-06',
      topic_title: 'Compare Values Using Ratios',
      learning_outcome:
        'Find how many times one value is larger than another given their ratio, and vice versa.',
      category: 'Ratio and Proportion',
      order_index: 6,
    },
    {
      topic_code: 'G6-Q2-NA-07',
      topic_title: 'Solve Word Problems Involving Ratio and Proportion',
      learning_outcome: 'Solve problems involving ratio and proportion.',
      category: 'Problem Solving',
      order_index: 7,
    },
    // Percentages and their relationship to fractions and decimals
    {
      topic_code: 'G6-Q2-NA-08',
      topic_title: 'Relate Percentages to Fractions and Decimals',
      learning_outcome:
        'Illustrate and explain the relationships between percentages, fractions, and decimals.',
      category: 'Percentages',
      order_index: 8,
    },
    {
      topic_code: 'G6-Q2-NA-09',
      topic_title: 'Identify and Explain Uses of Percentages',
      learning_outcome: 'Identify and explain the uses of percentages.',
      category: 'Percentages',
      order_index: 9,
    },
    // Exponential form and GEMDAS
    {
      topic_code: 'G6-Q2-NA-10',
      topic_title: 'Write Numbers in Exponential Form and Expanded Form',
      learning_outcome:
        'Write numbers in exponential form (e.g., 2×2×2 = 2³), and write exponential form as repeated multiplication.',
      category: 'Number Sense',
      order_index: 10,
    },
    {
      topic_code: 'G6-Q2-NA-11',
      topic_title: 'Evaluate Numbers in Exponential Form',
      learning_outcome: 'Give the value of numbers expressed in exponential form.',
      category: 'Number Sense',
      order_index: 11,
    },
    {
      topic_code: 'G6-Q2-NA-12',
      topic_title: 'Perform Calculations with Exponents Using GEMDAS',
      learning_outcome:
        'Perform calculations involving numbers in exponential form by applying the GEMDAS rules.',
      category: 'Operations',
      order_index: 12,
    },
  ],

  // Quarter 3 – Volume, capacity, area & perimeter, circles
  quarter3: [
    // Measurement and Geometry (MG) – Volume, capacity, perimeter, area, circles
    {
      topic_code: 'G6-Q3-MG-01',
      topic_title: 'Choose Appropriate Units for Volume and Capacity',
      learning_outcome:
        'Determine appropriate units for measuring volume and capacity.',
      category: 'Measurement',
      order_index: 1,
    },
    {
      topic_code: 'G6-Q3-MG-02',
      topic_title: 'Convert Between Cubic Centimeters and Liters',
      learning_outcome: 'Convert cubic centimeters (cu. cm) to liters (L), and vice versa.',
      category: 'Measurement',
      order_index: 2,
    },
    {
      topic_code: 'G6-Q3-MG-03',
      topic_title: 'Find Volume of Cubes and Rectangular Prisms',
      learning_outcome:
        'Find the volume of a cube and of a rectangular prism using standard units of measurement.',
      category: 'Measurement',
      order_index: 3,
    },
    {
      topic_code: 'G6-Q3-MG-04',
      topic_title: 'Solve Problems Involving Volume',
      learning_outcome: 'Solve problems involving volumes of cubes and rectangular prisms.',
      category: 'Problem Solving',
      order_index: 4,
    },
    {
      topic_code: 'G6-Q3-MG-05',
      topic_title: 'Solve Problems Involving Capacity',
      learning_outcome: 'Solve problems involving capacity.',
      category: 'Problem Solving',
      order_index: 5,
    },
    {
      topic_code: 'G6-Q3-MG-06',
      topic_title: 'Convert Between Square Centimeters and Square Meters',
      learning_outcome: 'Convert square centimeters (sq. cm) to square meters (sq. m), and vice versa.',
      category: 'Measurement',
      order_index: 6,
    },
    {
      topic_code: 'G6-Q3-MG-07',
      topic_title: 'Find Area of Composite Figures',
      learning_outcome:
        'Find the area, in sq. m or sq. cm, of composite figures composed of triangles, squares, and rectangles.',
      category: 'Measurement',
      order_index: 7,
    },
    {
      topic_code: 'G6-Q3-MG-08',
      topic_title:
        'Solve Problems Involving Perimeter and Area of Triangles, Parallelograms, Trapezoids, and Composite Figures',
      learning_outcome:
        'Solve problems involving the perimeter and area of triangles, parallelograms, trapezoids, and composite figures composed of triangles, squares, and rectangles.',
      category: 'Problem Solving',
      order_index: 8,
    },
    {
      topic_code: 'G6-Q3-MG-09',
      topic_title: 'Draw Circles with Given Radii',
      learning_outcome: 'Draw circles with different radii using a pair of compasses.',
      category: 'Geometry',
      order_index: 9,
    },
    {
      topic_code: 'G6-Q3-MG-10',
      topic_title: 'Identify Parts of a Circle',
      learning_outcome: 'Identify and describe the parts of a circle.',
      category: 'Geometry',
      order_index: 10,
    },
    {
      topic_code: 'G6-Q3-MG-11',
      topic_title: 'Measure Circumference of Circles',
      learning_outcome: 'Measure the circumference of circles using appropriate tools.',
      category: 'Measurement',
      order_index: 11,
    },
    {
      topic_code: 'G6-Q3-MG-12',
      topic_title: 'Approximate the Value of Pi',
      learning_outcome:
        'Approximate the value of pi (π) as the ratio of circumference to diameter.',
      category: 'Geometry',
      order_index: 12,
    },
    {
      topic_code: 'G6-Q3-MG-13',
      topic_title: 'Find Circumference of a Circle',
      learning_outcome: 'Find the circumference of a circle using C = πd or C = 2πr.',
      category: 'Measurement',
      order_index: 13,
    },
  ],

  // Quarter 4 – Area of circles, composite figures, pie graphs, GCF & LCM
  quarter4: [
    // Measurement and Geometry (MG) – Area of circles and composite figures
    {
      topic_code: 'G6-Q4-MG-01',
      topic_title: 'Explore the Area of a Circle',
      learning_outcome:
        'Explore inductively the area of a circle leading to the formula A = πr².',
      category: 'Geometry',
      order_index: 1,
    },
    {
      topic_code: 'G6-Q4-MG-02',
      topic_title: 'Find Area of a Circle',
      learning_outcome: 'Find the area of a circle using the formula A = πr².',
      category: 'Measurement',
      order_index: 2,
    },
    {
      topic_code: 'G6-Q4-MG-03',
      topic_title: 'Find Area of Composite Figures with Circles and Polygons',
      learning_outcome:
        'Find the area of composite figures composed of any two or more of the following: triangle, square, rectangle, circle, and semicircle.',
      category: 'Measurement',
      order_index: 3,
    },
    {
      topic_code: 'G6-Q4-MG-04',
      topic_title:
        'Solve Problems Involving Circumference and Area of Circles and Composite Figures',
      learning_outcome:
        'Solve problems involving circumference and area of circles, and composite figures.',
      category: 'Problem Solving',
      order_index: 4,
    },
    // Data and Probability (DP) – Pie graphs and interpreting data
    {
      topic_code: 'G6-Q4-DP-01',
      topic_title: 'Find Angle Measures and Percentages for Pie Graphs',
      learning_outcome:
        'Find the angle measures and/or percentages based on the given data for a pie graph.',
      category: 'Data',
      order_index: 5,
    },
    {
      topic_code: 'G6-Q4-DP-02',
      topic_title: 'Construct Pie Graphs',
      learning_outcome: 'Construct a pie graph using appropriate tools.',
      category: 'Data',
      order_index: 6,
    },
    {
      topic_code: 'G6-Q4-DP-03',
      topic_title: 'Interpret Pie Graphs',
      learning_outcome: 'Interpret data presented in a pie graph.',
      category: 'Data',
      order_index: 7,
    },
    {
      topic_code: 'G6-Q4-DP-04',
      topic_title: 'Interpret Data from Digital Media',
      learning_outcome:
        'Interpret data from digital media that are presented in tabular or graphical form.',
      category: 'Data',
      order_index: 8,
    },
    {
      topic_code: 'G6-Q4-DP-05',
      topic_title: 'Draw Conclusions from Pie Graphs',
      learning_outcome:
        'Draw conclusions or make inferences based on data presented in a pie graph.',
      category: 'Problem Solving',
      order_index: 9,
    },
    {
      topic_code: 'G6-Q4-DP-06',
      topic_title: 'Solve Problems Using Pie Graphs',
      learning_outcome: 'Solve problems using data presented in a pie graph.',
      category: 'Problem Solving',
      order_index: 10,
    },
    // Number and Algebra (NA) – Common factors, multiples, GCF, LCM
    {
      topic_code: 'G6-Q4-NA-01',
      topic_title: 'Find Common Factors and Greatest Common Factor (GCF)',
      learning_outcome:
        'Determine the common factors and the greatest common factor (GCF) of two numbers using the methods of listing, prime factorization, and continuous division.',
      category: 'Number Sense',
      order_index: 11,
    },
    {
      topic_code: 'G6-Q4-NA-02',
      topic_title: 'Find Common Multiples and Least Common Multiple (LCM)',
      learning_outcome:
        'Find the common multiples and least common multiple (LCM) of two numbers using the methods of listing, prime factorization, and continuous division.',
      category: 'Number Sense',
      order_index: 12,
    },
    {
      topic_code: 'G6-Q4-NA-03',
      topic_title: 'Solve Problems Involving GCF and LCM',
      learning_outcome: 'Solve problems involving GCF and LCM.',
      category: 'Problem Solving',
      order_index: 13,
    },
  ],
};

async function seedGrade6Quarters() {
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

    // Delete existing Grade 6 topics
    console.log('Clearing existing Grade 6 topics...');
    await dbRun(db, 'DELETE FROM curriculum_topics WHERE grade = 6');

    // Insert Grade 6 quarter topics
    console.log('Seeding Grade 6 quarter topics...');
    let inserted = 0;

    for (const [quarterName, topics] of Object.entries(grade6Quarters)) {
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
              6,
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

    console.log(`\n✅ Successfully inserted ${inserted} Grade 6 topics across 4 quarters`);
    console.log(`\n📊 Summary:`);
    console.log(`   Quarter 1: ${grade6Quarters.quarter1.length} quizzes`);
    console.log(`   Quarter 2: ${grade6Quarters.quarter2.length} quizzes`);
    console.log(`   Quarter 3: ${grade6Quarters.quarter3.length} quizzes`);
    console.log(`   Quarter 4: ${grade6Quarters.quarter4.length} quizzes`);
    console.log(`   Total: ${inserted} quizzes`);

    await dbClose(db);
  } catch (error) {
    console.error('❌ Error seeding Grade 6 quarters:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedGrade6Quarters()
    .then(() => {
      console.log('\n🎉 Grade 6 quarter seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedGrade6Quarters, grade6Quarters };

