import { CurriculumStructure, Module } from './types';
import { interdisciplinaryModule } from './interdisciplinary';
import {
  tragwerkeSpecialization,
  theorieSimulationSpecialization,
  geotechnikSpecialization,
  bauprozessmanagementSpecialization,
  verkehrMobilitaetSpecialization,
  wasserRessourcenSpecialization
} from './specializations';
import { electiveCourses, transferableSkillsCourses } from './electives';

export const complementaryModule: Module = {
  id: 'm3',
  name: 'Ergänzende Ausbildung (M3)',
  shortName: 'M3',
  requiredEcts: 15, // Reduced by overflow from M1/M2
  courses: [] // Courses from non-selected specializations
};

export const electivesModule: Module = {
  id: 'electives',
  name: 'Freie Wahlfächer und Transferable Skills',
  shortName: 'FW+TS',
  requiredEcts: 9, // Min 4.5 from Transferable Skills
  courses: electiveCourses
};

export const transferableSkillsModule: Module = {
  id: 'transferable-skills',
  name: 'Transferable Skills (min. 4.5 ECTS erforderlich)',
  shortName: 'TS',
  requiredEcts: 4.5,
  courses: transferableSkillsCourses
};

export const curriculum: CurriculumStructure = {
  totalEcts: 120,
  interdisciplinary: interdisciplinaryModule,
  specializations: [
    tragwerkeSpecialization,
    theorieSimulationSpecialization,
    geotechnikSpecialization,
    bauprozessmanagementSpecialization,
    verkehrMobilitaetSpecialization,
    wasserRessourcenSpecialization
  ],
  complementary: complementaryModule,
  electives: electivesModule,
  thesis: 30
};

export {
  tragwerkeSpecialization,
  theorieSimulationSpecialization,
  geotechnikSpecialization,
  bauprozessmanagementSpecialization,
  verkehrMobilitaetSpecialization,
  wasserRessourcenSpecialization
};
