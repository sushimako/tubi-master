const fs = require('fs');
const path = require('path');

// Read the ECTS map
const ectsMap = JSON.parse(fs.readFileSync('/tmp/ects-map.json', 'utf8'));

// Process a TypeScript file and update ECTS values
function updateEctsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  let changes = [];
  
  // Match course entries with courseNumber and update ECTS
  // Pattern: courseNumber: 'XXX.XXX' ... ects: Y
  const coursePattern = /courseNumber:\s*'(\d{3}\.\d{3})'[^}]*ects:\s*([\d.]+)/g;
  
  content = content.replace(coursePattern, (match, courseNum, oldEcts) => {
    const newEcts = ectsMap[courseNum];
    if (newEcts !== undefined && newEcts !== parseFloat(oldEcts)) {
      changes.push(`  ${courseNum}: ${oldEcts} -> ${newEcts}`);
      updated = true;
      return match.replace(/ects:\s*[\d.]+/, `ects: ${newEcts}`);
    }
    return match;
  });
  
  // Also match entries where id matches the course number
  // Pattern: id: 'XXX.XXX' ... ects: Y
  const idPattern = /\{\s*id:\s*'(\d{3}\.\d{3})'[^}]*ects:\s*([\d.]+)/g;
  
  content = content.replace(idPattern, (match, courseNum, oldEcts) => {
    const newEcts = ectsMap[courseNum];
    if (newEcts !== undefined && newEcts !== parseFloat(oldEcts)) {
      if (!changes.some(c => c.includes(courseNum))) {
        changes.push(`  ${courseNum}: ${oldEcts} -> ${newEcts}`);
      }
      updated = true;
      return match.replace(/ects:\s*[\d.]+/, `ects: ${newEcts}`);
    }
    return match;
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}:`);
    changes.forEach(c => console.log(c));
    return changes.length;
  }
  return 0;
}

// Files to update
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

let totalChanges = 0;
files.forEach(file => {
  if (fs.existsSync(file)) {
    totalChanges += updateEctsInFile(file);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log(`\nTotal ECTS values updated: ${totalChanges}`);
