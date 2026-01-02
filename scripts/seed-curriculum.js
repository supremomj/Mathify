// Seed DepEd MATATAG Curriculum Learning Outcomes
// Grades 1-6 based on Mathematics-CG-2023.pdf

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');
const fs = require('fs');

// Use the same database path as the main app
function getDatabasePath() {
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

const dbPath = getDatabasePath();
console.log('Using database path:', dbPath);

// Curriculum data based on DepEd MATATAG Curriculum
const curriculumData = [
  // Grade 1 - Source: pp. 19–20, 23–26
  { grade: 1, code: 'G1-2D-Shapes', title: '2-Dimensional Shapes', category: 'Geometry', outcome: 'Identify and distinguish simple 2-dimensional shapes.', order: 1 },
  { grade: 1, code: 'G1-Numbers-100', title: 'Whole Numbers up to 100', category: 'Number Sense', outcome: 'Count, recognize, and represent whole numbers up to 100.', order: 2 },
  { grade: 1, code: 'G1-Ordinal-10', title: 'Ordinal Numbers up to 10th', category: 'Number Sense', outcome: 'Use ordinal numbers up to 10th to describe position.', order: 3 },
  { grade: 1, code: 'G1-Add-Sub-100', title: 'Addition and Subtraction up to 100', category: 'Operations', outcome: 'Perform addition of numbers with sums up to 100 and subtraction where both numbers are less than 100.', order: 4 },
  { grade: 1, code: 'G1-Fractions', title: 'Fractions ½ and ¼', category: 'Number Sense', outcome: 'Recognize and represent fractions ½ and ¼.', order: 5 },
  { grade: 1, code: 'G1-Money-100', title: 'Philippine Money up to ₱100', category: 'Measurement', outcome: 'Identify and determine the value of Philippine coins and bills up to ₱100, and perform addition/subtraction of money within ₱100.', order: 6 },
  { grade: 1, code: 'G1-Measurement', title: 'Non-Standard Measurement', category: 'Measurement', outcome: 'Use non-standard units to measure length, distance, and time (hours, half-hours, quarter hours, days, weeks, months, years).', order: 7 },
  { grade: 1, code: 'G1-Data', title: 'Pictographs without Scale', category: 'Data', outcome: 'Represent and interpret simple data using pictographs without a scale.', order: 8 },
  { grade: 1, code: 'G1-Patterns', title: 'Repeating Patterns', category: 'Patterns', outcome: 'Extend and create simple repeating patterns.', order: 9 },
  { grade: 1, code: 'G1-Problem-Solving', title: 'Real-Life Problem Solving', category: 'Problem Solving', outcome: 'Apply counting, addition, subtraction, and pattern recognition to solve real-life problems.', order: 10 },

  // Grade 2 - Source: pp. 20–21, 27–31
  { grade: 2, code: 'G2-Numbers-1000', title: 'Whole Numbers up to 1,000 and Ordinal Numbers', category: 'Number Sense', outcome: 'Count, recognize, and represent whole numbers up to 1,000 and use ordinal numbers up to 20th.', order: 1 },
  { grade: 2, code: 'G2-Add-Sub-1000', title: 'Addition and Subtraction up to 1,000', category: 'Operations', outcome: 'Add and subtract numbers up to 1,000, with and without regrouping.', order: 2 },
  { grade: 2, code: 'G2-Mult-Div-Tables', title: 'Multiplication and Division Tables 2-5, 10', category: 'Operations', outcome: 'Perform multiplication and division of whole numbers using the 2, 3, 4, 5, and 10 multiplication tables.', order: 3 },
  { grade: 2, code: 'G2-Odd-Even', title: 'Odd and Even Numbers', category: 'Number Sense', outcome: 'Identify odd and even numbers.', order: 4 },
  { grade: 2, code: 'G2-Fractions', title: 'Unit and Similar Fractions', category: 'Number Sense', outcome: 'Recognize and order unit and similar fractions with denominators 2, 3, 4, 5, 6, and 8.', order: 5 },
  { grade: 2, code: 'G2-Money-1000', title: 'Philippine Money up to ₱1,000', category: 'Measurement', outcome: 'Determine and compare the value of Philippine coins and bills up to ₱1,000 and perform addition of amounts up to ₱1,000.', order: 6 },
  { grade: 2, code: 'G2-Length', title: 'Length and Distance', category: 'Measurement', outcome: 'Measure, compare, and estimate length and distance using appropriate units (cm, m).', order: 7 },
  { grade: 2, code: 'G2-Time', title: 'Time and Duration', category: 'Measurement', outcome: 'Tell and write time using hours and minutes (a.m. and p.m.); determine elapsed time and duration.', order: 8 },
  { grade: 2, code: 'G2-Geometry', title: 'Lines, Surfaces, and Perimeter', category: 'Geometry', outcome: 'Identify straight and curved lines, flat and curved surfaces, and find the perimeter of triangles, squares, and rectangles.', order: 9 },
  { grade: 2, code: 'G2-Data', title: 'Pictographs with Scale', category: 'Data', outcome: 'Represent and interpret data using pictographs with a scale.', order: 10 },
  { grade: 2, code: 'G2-Patterns', title: 'Increasing and Decreasing Patterns', category: 'Patterns', outcome: 'Recognize, extend, and create increasing and decreasing patterns.', order: 11 },

  // Grade 3 - Source: pp. 21, 32–36
  { grade: 3, code: 'G3-Numbers-10000', title: 'Whole Numbers up to 10,000 and Ordinal Numbers', category: 'Number Sense', outcome: 'Read, write, and represent whole numbers up to 10,000 and ordinal numbers up to 100th.', order: 1 },
  { grade: 3, code: 'G3-Add-Sub-4Digit', title: '4-Digit Addition and Subtraction', category: 'Operations', outcome: 'Perform addition and subtraction of up to 4-digit numbers and money up to ₱10,000.', order: 2 },
  { grade: 3, code: 'G3-Mult-Div-Tables', title: 'Multiplication Tables 6-9', category: 'Operations', outcome: 'Perform multiplication and division using the 6, 7, 8, and 9 multiplication tables.', order: 3 },
  { grade: 3, code: 'G3-Estimation', title: 'Estimation', category: 'Operations', outcome: 'Estimate products and quotients using rounding.', order: 4 },
  { grade: 3, code: 'G3-Fractions', title: 'Similar Fractions Operations', category: 'Number Sense', outcome: 'Identify, represent, and operate on similar fractions.', order: 5 },
  { grade: 3, code: 'G3-Geometry-Basics', title: 'Points, Lines, Rays, and Line Segments', category: 'Geometry', outcome: 'Understand points, lines, rays, line segments, and types of lines (parallel, perpendicular, intersecting).', order: 6 },
  { grade: 3, code: 'G3-Area-Mass', title: 'Area, Mass, and Capacity', category: 'Measurement', outcome: 'Find the area of squares and rectangles and measure mass and capacity.', order: 7 },
  { grade: 3, code: 'G3-Symmetry', title: 'Line Symmetry and Translation', category: 'Geometry', outcome: 'Identify line symmetry and translation of figures.', order: 8 },
  { grade: 3, code: 'G3-Time-Elapsed', title: 'Time Calculation', category: 'Measurement', outcome: 'Read and write time in hours and minutes; calculate elapsed time.', order: 9 },
  { grade: 3, code: 'G3-Data-Probability', title: 'Data and Probability', category: 'Data', outcome: 'Interpret data from tables and bar graphs, and identify outcomes from simple experiments.', order: 10 },

  // Grade 4 - Source: pp. 20, 37–40
  { grade: 4, code: 'G4-Numbers-1M', title: 'Whole Numbers up to 1,000,000', category: 'Number Sense', outcome: 'Read, write, and represent whole numbers up to 1,000,000.', order: 1 },
  { grade: 4, code: 'G4-Four-Operations', title: 'Four Operations with Large Numbers', category: 'Operations', outcome: 'Perform the four operations (addition, subtraction, multiplication, division) with whole numbers up to 1,000,000.', order: 2 },
  { grade: 4, code: 'G4-Fractions-Mixed', title: 'Similar and Dissimilar Fractions', category: 'Number Sense', outcome: 'Add and subtract similar and dissimilar fractions (including mixed numbers) and identify equivalent fractions.', order: 3 },
  { grade: 4, code: 'G4-Factors-Multiples', title: 'Factors and Multiples', category: 'Number Sense', outcome: 'Identify factors and multiples of numbers up to 100.', order: 4 },
  { grade: 4, code: 'G4-Decimals', title: 'Decimal Numbers', category: 'Number Sense', outcome: 'Understand decimal numbers and their relation to fractions.', order: 5 },
  { grade: 4, code: 'G4-Angles-Shapes', title: 'Angles and Quadrilaterals', category: 'Geometry', outcome: 'Recognize and classify angles (right, acute, obtuse) and properties of triangles and quadrilaterals.', order: 6 },
  { grade: 4, code: 'G4-Unit-Conversion', title: 'Unit Conversion', category: 'Measurement', outcome: 'Measure and convert units of length, mass, capacity, and time.', order: 7 },
  { grade: 4, code: 'G4-Perimeter-Area', title: 'Perimeter and Area', category: 'Geometry', outcome: 'Find perimeter and area of quadrilaterals and composite figures.', order: 8 },
  { grade: 4, code: 'G4-Reflection', title: 'Symmetry and Reflection', category: 'Geometry', outcome: 'Identify lines of symmetry and perform reflection with shapes.', order: 9 },
  { grade: 4, code: 'G4-Line-Graphs', title: 'Line Graphs', category: 'Data', outcome: 'Represent and interpret data in tables and single line graphs.', order: 10 },

  // Grade 5 - Source: pp. 20–21, 41–44
  { grade: 5, code: 'G5-GEMDAS', title: 'GEMDAS Rule', category: 'Operations', outcome: 'Apply the GEMDAS rule in solving expressions.', order: 1 },
  { grade: 5, code: 'G5-Fractions-Decimals', title: 'Fraction and Decimal Operations', category: 'Operations', outcome: 'Perform multiplication and division of fractions, and operations with decimals up to ten thousandths.', order: 2 },
  { grade: 5, code: 'G5-Divisibility-Primes', title: 'Divisibility and Prime Numbers', category: 'Number Sense', outcome: 'Identify and use divisibility rules; distinguish between prime and composite numbers.', order: 3 },
  { grade: 5, code: 'G5-Combined-Operations', title: 'Combined Operations', category: 'Operations', outcome: 'Perform combined operations with fractions and decimals.', order: 4 },
  { grade: 5, code: 'G5-Real-World', title: 'Real-World Problem Solving', category: 'Problem Solving', outcome: 'Solve real-world problems involving the four operations.', order: 5 },
  { grade: 5, code: 'G5-Area-Shapes', title: 'Area of Parallelograms, Triangles, Trapezoids', category: 'Geometry', outcome: 'Determine area of parallelograms, triangles, and trapezoids.', order: 6 },
  { grade: 5, code: 'G5-Solids', title: 'Prisms and Pyramids', category: 'Geometry', outcome: 'Identify prisms and pyramids and find surface area of solid figures.', order: 7 },
  { grade: 5, code: 'G5-Time-Zones', title: 'Time Zones', category: 'Measurement', outcome: 'Interpret and convert between 12-hour and 24-hour time; relate to world time zones.', order: 8 },
  { grade: 5, code: 'G5-Rotation', title: 'Rotation of Shapes', category: 'Geometry', outcome: 'Perform rotations about a point given an angle.', order: 9 },
  { grade: 5, code: 'G5-Double-Graphs', title: 'Double Bar and Line Graphs', category: 'Data', outcome: 'Present and interpret double bar graphs and double line graphs.', order: 10 },
  { grade: 5, code: 'G5-Probability', title: 'Theoretical Probability', category: 'Data', outcome: 'Determine and explain theoretical probability of simple events.', order: 11 },

  // Grade 6 - Source: pp. 21–22, 45–47
  { grade: 6, code: 'G6-Mixed-Operations', title: 'Operations with Mixed Numbers', category: 'Operations', outcome: 'Perform the four operations with decimals, fractions, whole numbers, and mixed numbers.', order: 1 },
  { grade: 6, code: 'G6-Ratio-Proportion', title: 'Ratio, Proportion, and Percentages', category: 'Number Sense', outcome: 'Solve problems involving ratio, proportion, and percentages, and relate them with fractions and decimals.', order: 2 },
  { grade: 6, code: 'G6-Exponents-GEMDAS', title: 'Exponents and GEMDAS', category: 'Operations', outcome: 'Apply exponential form and GEMDAS in calculations.', order: 3 },
  { grade: 6, code: 'G6-GCF-LCM', title: 'GCF and LCM', category: 'Number Sense', outcome: 'Determine common factors, GCF, common multiples, and LCM.', order: 4 },
  { grade: 6, code: 'G6-Transformations', title: 'Tessellation and Transformations', category: 'Geometry', outcome: 'Explore tessellation, translation, reflection, and rotation of shapes.', order: 5 },
  { grade: 6, code: 'G6-Area-Composite', title: 'Area of Composite Figures', category: 'Geometry', outcome: 'Compute perimeter and area of triangles, parallelograms, trapezoids, and composite figures.', order: 6 },
  { grade: 6, code: 'G6-Circle', title: 'Circle Properties and Area', category: 'Geometry', outcome: 'Identify parts of a circle (radius, diameter, circumference) and compute its area.', order: 7 },
  { grade: 6, code: 'G6-Volume', title: 'Volume and Capacity', category: 'Measurement', outcome: 'Find volume of cubes and rectangular prisms, and convert units of volume and capacity.', order: 8 },
  { grade: 6, code: 'G6-Pie-Graphs', title: 'Pie Graphs', category: 'Data', outcome: 'Construct and interpret pie graphs to represent and analyze data.', order: 9 }
];

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

async function seedCurriculum() {
  try {
    const db = await getDatabase();
    console.log('✓ Connected to database');

    // Create curriculum tables if they don't exist
    console.log('Creating curriculum tables...');
    await dbRun(db, `
      CREATE TABLE IF NOT EXISTS curriculum_topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        grade INTEGER NOT NULL,
        topic_code TEXT NOT NULL,
        topic_title TEXT NOT NULL,
        description TEXT,
        learning_outcome TEXT NOT NULL,
        category TEXT,
        order_index INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(grade, topic_code)
      )
    `);
    
    await dbRun(db, `
      CREATE TABLE IF NOT EXISTS student_topic_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        topic_id INTEGER NOT NULL,
        progress_percentage INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT 0,
        last_accessed DATETIME,
        best_score INTEGER,
        attempts INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (topic_id) REFERENCES curriculum_topics(id) ON DELETE CASCADE,
        UNIQUE(user_id, topic_id)
      )
    `);
    console.log('✓ Curriculum tables created');

    // Clear existing curriculum data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing curriculum data...');
    try {
      await dbRun(db, 'DELETE FROM student_topic_progress');
    } catch (err) {
      // Table might not exist yet, that's okay
    }
    try {
      await dbRun(db, 'DELETE FROM curriculum_topics');
    } catch (err) {
      // Table might not exist yet, that's okay
    }

    console.log('Seeding curriculum data...');
    let inserted = 0;
    let skipped = 0;

    for (const topic of curriculumData) {
      try {
        await dbRun(db,
          `INSERT INTO curriculum_topics (grade, topic_code, topic_title, description, learning_outcome, category, order_index)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            topic.grade,
            topic.code,
            topic.title,
            null, // description
            topic.outcome,
            topic.category,
            topic.order
          ]
        );
        inserted++;
      } catch (err) {
        if (err.message.includes('UNIQUE constraint')) {
          skipped++;
          console.log(`  ⚠ Skipped duplicate: ${topic.code}`);
        } else {
          console.error(`  ✗ Error inserting ${topic.code}:`, err.message);
        }
      }
    }

    console.log(`\n✓ Curriculum seeding complete!`);
    console.log(`  Inserted: ${inserted} topics`);
    console.log(`  Skipped: ${skipped} topics (duplicates)`);
    console.log(`  Total topics: ${curriculumData.length}`);

    await dbClose(db);
  } catch (err) {
    console.error('✗ Error seeding curriculum:', err);
    process.exit(1);
  }
}

// Run the seeding
seedCurriculum();

