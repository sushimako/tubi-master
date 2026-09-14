import { Specialization } from '../types';

export const wasserRessourcenSpecialization: Specialization = {
  id: 'wr',
  name: 'Wasser und Ressourcen',
  shortName: 'WR',
  m1: {
    id: 'm1-wr',
    name: 'Masterspezifische Ausbildung Wasser und Ressourcen',
    shortName: 'M1 WR',
    requiredEcts: 12,
    courses: [
      { id: '222.570', name: 'Engineering Hydrology 2', type: 'VU', ects: 2.5, hours: 2, semester: 'W', courseNumber: '222.570' },
      { id: '222.571', name: 'Wasserwirtschaft und Flussgebietsmanagement', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '222.571' },
      { id: '226.043', name: 'Abwasserreinigung', type: 'VO', ects: 2.5, hours: 2, semester: 'W', courseNumber: '226.043' },
      { id: '226.054', name: 'Resource Management', type: 'VU', ects: 2, hours: 1.5, semester: 'W', courseNumber: '226.054' },
      { id: 'abfallwirtschaft', name: 'Abfallwirtschaft und Entsorgungstechnik', type: 'VU', ects: 1.5, hours: 1.5 },
      { id: '222.573', name: 'Wasserbau', type: 'VU', ects: 4, hours: 3, semester: 'S', courseNumber: '222.573' }
    ]
  },
  m2: {
    id: 'm2-wr',
    name: 'Vertiefende Ausbildung Wasser und Ressourcen',
    shortName: 'M2 WR',
    requiredEcts: 16,
    courses: [
      { id: '222.574', name: 'Hydraulik 2', type: 'VO', ects: 3.5, hours: 2.5, semester: 'W', courseNumber: '222.574' },
      { id: '222.575', name: 'Talsperren', type: 'VO', ects: 2, hours: 1.5, semester: 'W', courseNumber: '222.575' },
      { id: 'stahlwasserbau', name: 'Stahlwasserbau', type: 'VO', ects: 1.5, hours: 1.5 },
      { id: 'verkehrswasserbau', name: 'Verkehrswasserbau', type: 'VO', ects: 1.5, hours: 1.5 },
      { id: '222.578', name: 'Wasserbauliches Versuchswesen', type: 'VU', ects: 2, hours: 1.5, semester: 'S', courseNumber: '222.578' },
      { id: 'grundwassermodellierung', name: 'Grundwassermodellierung', type: 'VU', ects: 3, hours: 3 },
      { id: '226.045', name: 'Wasserwirtschaft und Flussgebietsmanagement', type: 'UE', ects: 3, hours: 3, semester: 'S', courseNumber: '226.045' },
      { id: '222.580', name: 'Modelling and simulation methods in water resource systems', type: 'VU', ects: 4, hours: 3, semester: 'W', courseNumber: '222.580' },
      { id: 'hydrometry', name: 'Hydrometry', type: 'VU', ects: 1.5, hours: 1.5 },
      { id: 'bio-chem-wasser', name: 'Biologie und Chemie in der Wassergütewirtschaft', type: 'VO', ects: 2, hours: 2 },
      { id: '226.044', name: 'Laborübung Abwasserreinigung', type: 'LU', ects: 2.5, hours: 2.5, semester: 'W', courseNumber: '226.044' },
      { id: 'niederschlagswasser', name: 'Niederschlagswasserbehandlung und Schmutzfrachtsimulation', type: 'VU', ects: 2, hours: 2 },
      { id: '226.047', name: 'Trinkwasserversorgung', type: 'VO', ects: 2, hours: 1.5, semester: 'S', courseNumber: '226.047' },
      { id: 'env-economic', name: 'Environmental and Economic Assessment', type: 'VU', ects: 2.5, hours: 2.5 },
      { id: '226.056', name: 'Thermische Abfallverwertung', type: 'VO', ects: 1.5, hours: 1, semester: 'W', courseNumber: '226.056' },
      { id: '226.057', name: 'Deponietechnik und Altlastensanierung', type: 'VO', ects: 2.5, hours: 1.5, semester: 'W', courseNumber: '226.057' },
      { id: '226.058', name: 'Laborübung Ressourcenmanagement und Abfallwirtschaft', type: 'LU', ects: 2, hours: 2, semester: 'W', courseNumber: '226.058' },
      { id: '222.567', name: 'Projektarbeit Wasser und Ressourcen - Wasserbau', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '222.567' },
      { id: '226.040', name: 'Projektarbeit Wasser und Ressourcen - Wassergütewirtschaft', type: 'PA', ects: 6, hours: 6, semester: 'WS', courseNumber: '226.040' },
      { id: '226.041', name: 'Projektarbeit Wasser und Ressourcen - Abfallwirtschaft und Ressourcenmanagement', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '226.041' }
    ]
  }
};
