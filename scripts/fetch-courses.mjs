// Script to fetch course information from TISS
// This script generates course data that can be manually used to update the TypeScript files
import * as fs from 'fs';
import * as path from 'path';

// Extract all course numbers from source files
function extractCourseNumbers() {
  const dataDir = path.join(process.cwd(), 'src/data');
  const files = [
    'interdisciplinary.ts',
    'electives.ts',
    'specializations/tragwerke.ts',
    'specializations/theorie-simulation.ts',
    'specializations/geotechnik.ts',
    'specializations/bauprozessmanagement.ts',
    'specializations/verkehr-mobilitaet.ts',
    'specializations/wasser-ressourcen.ts'
  ];
  
  const courseNumbers = new Set();
  
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.matchAll(/courseNumber: '([\d.]+)'/g);
      for (const match of matches) {
        courseNumbers.add(match[1]);
      }
    }
  }
  
  return Array.from(courseNumbers).sort();
}

function main() {
  console.log('Extracting course numbers from source files...');
  const courseNumbers = extractCourseNumbers();
  console.log(`Found ${courseNumbers.length} unique course numbers\n`);
  
  // Output course numbers for browser fetching
  const outputPath = path.join(process.cwd(), 'scripts/course-numbers.json');
  fs.writeFileSync(outputPath, JSON.stringify(courseNumbers, null, 2));
  console.log(`Saved course numbers to ${outputPath}`);
  
  // Print TISS URLs for reference
  console.log('\nTISS URLs:');
  for (const cn of courseNumbers.slice(0, 10)) {
    console.log(`  https://tiss.tuwien.ac.at/course/courseDetails.xhtml?courseNr=${cn.replace('.', '')}`);
  }
  console.log(`  ... and ${courseNumbers.length - 10} more`);
}

main();
