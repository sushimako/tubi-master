// Script to update TypeScript course files with TISS data
import * as fs from 'fs';
import * as path from 'path';

// Load TISS course data
const tissDataPath = path.join(process.cwd(), 'scripts/courses-from-tiss.json');
const tissData = JSON.parse(fs.readFileSync(tissDataPath, 'utf8'));

console.log(`Loaded ${Object.keys(tissData).length} courses from TISS data`);

// Files to update
const dataDir = path.join(process.cwd(), 'src/data');
const filesToUpdate = [
  'interdisciplinary.ts',
  'electives.ts',
  'specializations/tragwerke.ts',
  'specializations/theorie-simulation.ts',
  'specializations/geotechnik.ts',
  'specializations/bauprozessmanagement.ts',
  'specializations/verkehr-mobilitaet.ts',
  'specializations/wasser-ressourcen.ts'
];

let totalUpdates = 0;

for (const file of filesToUpdate) {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fileUpdates = 0;
  
  // Find all courses with courseNumber in this file
  const courseRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*type:\s*'([^']+)',\s*ects:\s*([\d.]+),\s*hours:\s*([\d.]+)(?:,\s*semester:\s*'([^']+)')?(?:,\s*courseNumber:\s*'([^']+)')?(?:,\s*cancelled:\s*(true|false))?\s*\}/g;
  
  // Process each course match
  let match;
  const replacements = [];
  
  while ((match = courseRegex.exec(content)) !== null) {
    const [fullMatch, id, name, type, ects, hours, semester, courseNumber, cancelled] = match;
    
    // Find corresponding TISS data by courseNumber or id
    const tissKey = courseNumber || id;
    const tissCourse = tissData[tissKey];
    
    if (tissCourse) {
      // Build updated course string
      let newCourse = `{ id: '${id}', name: '${tissCourse.name}', type: '${tissCourse.type}', ects: ${tissCourse.ects}, hours: ${tissCourse.hours}`;
      
      if (tissCourse.semester) {
        newCourse += `, semester: '${tissCourse.semester}'`;
      }
      
      if (courseNumber) {
        newCourse += `, courseNumber: '${courseNumber}'`;
      }
      
      if (tissCourse.cancelled) {
        newCourse += `, cancelled: true`;
      }
      
      newCourse += ' }';
      
      // Check if anything changed
      const oldEcts = parseFloat(ects);
      const oldHours = parseFloat(hours);
      const oldSemester = semester;
      
      if (oldEcts !== tissCourse.ects || 
          oldHours !== tissCourse.hours || 
          oldSemester !== tissCourse.semester ||
          type !== tissCourse.type ||
          name !== tissCourse.name) {
        
        replacements.push({
          old: fullMatch,
          new: newCourse,
          courseNumber: tissKey,
          changes: {
            name: name !== tissCourse.name ? `${name} -> ${tissCourse.name}` : null,
            type: type !== tissCourse.type ? `${type} -> ${tissCourse.type}` : null,
            ects: oldEcts !== tissCourse.ects ? `${oldEcts} -> ${tissCourse.ects}` : null,
            hours: oldHours !== tissCourse.hours ? `${oldHours} -> ${tissCourse.hours}` : null,
            semester: oldSemester !== tissCourse.semester ? `${oldSemester} -> ${tissCourse.semester}` : null
          }
        });
      }
    }
  }
  
  // Apply replacements
  for (const rep of replacements) {
    content = content.replace(rep.old, rep.new);
    fileUpdates++;
    
    // Log changes
    const changes = Object.entries(rep.changes)
      .filter(([k, v]) => v !== null)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    
    console.log(`  ${file}: ${rep.courseNumber} - ${changes}`);
  }
  
  if (fileUpdates > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} with ${fileUpdates} changes`);
    totalUpdates += fileUpdates;
  }
}

console.log(`\nTotal updates: ${totalUpdates}`);
