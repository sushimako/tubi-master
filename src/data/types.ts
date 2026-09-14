// Types for the curriculum planner

export interface Course {
  id: string;
  name: string;
  type: 'VO' | 'VU' | 'SE' | 'UE' | 'LU' | 'EX' | 'PR' | 'PA';
  ects: number;
  hours: number;
  semester?: 'W' | 'S' | 'WS';
  courseNumber?: string;
  cancelled?: boolean;
}

export interface Module {
  id: string;
  name: string;
  shortName: string;
  requiredEcts: number;
  courses: Course[];
}

export interface Specialization {
  id: string;
  name: string;
  shortName: string;
  m1: Module;  // Masterspezifische Ausbildung (12 ECTS)
  m2: Module;  // Vertiefende Ausbildung (16 ECTS)
}

export interface CurriculumStructure {
  totalEcts: number;
  interdisciplinary: Module;           // 10 ECTS
  specializations: Specialization[];   // 6 options, choose 2 (2x28 ECTS)
  complementary: Module;               // M3: 15 ECTS (reduced by overflow)
  electives: Module;                   // 9 ECTS (min 4.5 Transferable Skills)
  thesis: number;                      // 30 ECTS
}

export interface SelectedCourses {
  [courseId: string]: boolean;
}

export interface UserSelection {
  specialization1: string | null;
  specialization2: string | null;
  courses: SelectedCourses;
}
