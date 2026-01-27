/**
 * Seed ALL curriculum data (base topics + quarter-based quizzes for Grades 1–6)
 * so you only have to run a single command.
 */

const { execSync } = require('child_process');
const path = require('path');

// Helper to run a command and stream its output
function run(label, command) {
  console.log(`\n────────────────────────────────────────────`);
  console.log(`▶ ${label}`);
  console.log(`$ ${command}`);
  console.log(`────────────────────────────────────────────\n`);

  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    console.log(`\n✅ Finished: ${label}\n`);
  } catch (err) {
    console.error(`\n❌ Failed: ${label}`);
    console.error(err.message || err);
    // Stop the pipeline on first failure
    process.exit(1);
  }
}

function main() {
  // 1. Base curriculum (coarse topics per grade)
  run('Base curriculum topics (all grades)', 'node scripts/seed-curriculum.js');

  // 2. Detailed quarter-based quizzes per grade
  run('Grade 1 quarter quizzes', 'node scripts/seed-grade1-quarters.js');
  run('Grade 2 quarter quizzes', 'node scripts/seed-grade2-quarters.js');
  run('Grade 3 quarter quizzes', 'node scripts/seed-grade3-quarters.js');
  run('Grade 4 quarter quizzes', 'node scripts/seed-grade4-quarters.js');
  run('Grade 5 quarter quizzes', 'node scripts/seed-grade5-quarters.js');
  run('Grade 6 quarter quizzes', 'node scripts/seed-grade6-quarters.js');

  console.log('\n🎉 All curriculum seeding completed successfully (Grades 1–6, all quarters)!');
}

if (require.main === module) {
  main();
}

