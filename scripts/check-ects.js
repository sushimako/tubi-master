const fs = require('fs');

// Read the ECTS map
const ectsMap = JSON.parse(fs.readFileSync('/tmp/ects-map.json', 'utf8'));

// Process a TypeScript file and check ECTS values
function checkEctsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const differences = [];
  
  // Find all course entries with ECTS - match the entire course object
  // Look for objects with either id or courseNumber that matches a course number pattern
  const objectRegex = /\{[^{}]*(?:id|courseNumber):\s*'(\d{3}\.\d{3})'[^{}]*\}/g;
  let match;
  
  while ((match = objectRegex.exec(content)) !== null) {
    const objText = match[0];
    const courseNumMatch = objText.match(/(?:id|courseNumber):\s*'(\d{3}\.\d{3})'/);
    const ectsMatch = objText.match(/\bects:\s*([\d.]+)/);
    
    if (courseNumMatch && ectsMatch) {
      const courseNum = courseNumMatch[1];
      const currentEcts = parseFloat(ectsMatch[1]);
      const correctEcts = ectsMap[courseNum];
      
      if (correctEcts !== undefined && correctEcts !== currentEcts) {
        differences.push({
          courseNumber: courseNum,
          current: currentEcts,
          correct: correctEcts
        });
      }
    }
  }
  
  return differences;
}

// Files to check
const files = [
  '/home/exedev/curriculum/src/data/electives.ts',
  '/home/exedev/curriculum/src/data/interdisciplinary.ts',
  '/home/exedev/curriculum/src/data/curriculum.ts',
  '/home/exedev/curriculum/src/data/specializations/tragwerke.ts',
  '/home/exedev/curriculum/src/data/specializations/theorie-simulation.ts',
  '/home/exedev/curriculum/src/data/specializations/geotechnik.ts',
  '/home/exedev/curriculum/src/data/specializations/bauprozessmanagement.ts',
  '/home/exedev/curriculum/src/data/specializations/verkehr-mobilitaet.ts',
  '/home/exedev/curriculum/src/data/specializations/wasser-ressourcen.ts'
];

let allDiffs = [];
files.forEach(file => {
  if (fs.existsSync(file)) {
    const diffs = checkEctsInFile(file);
    if (diffs.length > 0) {
      console.log(`\n${file}:`);
      diffs.forEach(d => {
        console.log(`  ${d.courseNumber}: ${d.current} should be ${d.correct}`);
      });
      allDiffs = allDiffs.concat(diffs);
    }
  }
});

if (allDiffs.length === 0) {
  console.log('All ECTS values with courseNumbers are correct!');
} else {
  console.log(`\nTotal courses with incorrect ECTS: ${allDiffs.length}`);
}
