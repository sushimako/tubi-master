import { Specialization } from '../types';

export const geotechnikSpecialization: Specialization = {
  id: 'gt',
  name: 'Geotechnik',
  shortName: 'GT',
  m1: {
    id: 'm1-gt',
    name: 'Masterspezifische Ausbildung Geotechnik',
    shortName: 'M1 GT',
    requiredEcts: 12,
    courses: [
      { id: '220.000', name: 'Fels- und Tunnelbau', type: 'VO', ects: 2.5, hours: 1.5, semester: 'W', courseNumber: '220.000' },
      { id: 'grundbau-2', name: 'Grundbau und Bodenmechanik 2', type: 'VO', ects: 3, hours: 2 },
      { id: '220.029', name: 'Bodendynamik', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '220.029' },
      { id: 'baugrunderkundung', name: 'Baugrunderkundung und Gebirgsklassifikation', type: 'VU', ects: 2.5, hours: 2 },
      { id: '203.098', name: 'Angewandte Felsmechanik', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '203.098' },
      { id: '220.005', name: 'Geotechnik und Naturgefahren', type: 'VU', ects: 2, hours: 1.5, semester: 'W', courseNumber: '220.005' }
    ]
  },
  m2: {
    id: 'm2-gt',
    name: 'Vertiefende Ausbildung Geotechnik',
    shortName: 'M2 GT',
    requiredEcts: 16,
    courses: [
      { id: '221.005', name: 'Grundbau und Bodenmechanik 2', type: 'LU', ects: 2, hours: 2, semester: 'W', courseNumber: '221.005' },
      { id: '220.033', name: 'Spezialtiefbau (inkl. Injektionstechnik)', type: 'VO', ects: 2.5, hours: 1.5, semester: 'W', courseNumber: '220.033' },
      { id: 'numerical-geotechnics', name: 'Numerical Geotechnics', type: 'VO', ects: 2.5, hours: 1.5 },
      { id: 'constitutive-soils', name: 'Constitutive Modelling of Soils', type: 'VO', ects: 2.5, hours: 1.5 },
      { id: 'geosynthetics', name: 'Geosynthetics', type: 'VO', ects: 2.5, hours: 1.5 },
      { id: 'angewandte-fels-ue', name: 'Angewandte Felsmechanik', type: 'UE', ects: 2, hours: 2 },
      { id: 'angewandte-fels-ex', name: 'Angewandte Felsmechanik', type: 'EX', ects: 2, hours: 2 },
      { id: '220.019', name: 'Stability Problems in Rock Engineering', type: 'SE', ects: 1.5, hours: 1.5, semester: 'W', courseNumber: '220.019' },
      { id: 'tech-gesteinskunde-vo', name: 'Technische Gesteinskunde', type: 'VO', ects: 2, hours: 1.5 },
      { id: 'tech-gesteinskunde-ue', name: 'Technische Gesteinskunde', type: 'UE', ects: 2, hours: 2 },
      { id: 'sanierung-naturstein', name: 'Sanierung von Bauwerken aus Naturstein', type: 'SE', ects: 1.5, hours: 1.5 },
      { id: '220.015', name: 'Finite Difference Modelling in Geoengineering', type: 'VU', ects: 2.5, hours: 2, semester: 'W', courseNumber: '220.015' },
      { id: '220.035', name: 'Ingenieurgeologie', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '220.035' },
      { id: '220.036', name: 'Übungen zu Ingenieurgeologie', type: 'UE', ects: 1, hours: 1, semester: 'W', courseNumber: '220.036' },
      { id: 'underground-excavation', name: 'Underground Excavation Design', type: 'SE', ects: 1.5, hours: 1.5 },
      { id: 'luftbild-geologie', name: 'Luftbildinterpretation zur Geologie', type: 'UE', ects: 1.5, hours: 1.5 },
      { id: 'sprengtechnik-vo', name: 'Sprengtechnik', type: 'VO', ects: 4.5, hours: 3 },
      { id: '220.024', name: 'Sprengtechnik', type: 'UE', ects: 2, hours: 2, semester: 'W', courseNumber: '220.024' },
      { id: '220.031', name: 'Projektarbeit Geotechnik - Ingenieurgeologie', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '220.031' },
      { id: '220.032', name: 'Projektarbeit Geotechnik', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '220.032' },
      { id: '220.043', name: 'Geothermie', type: 'VU', ects: 2, hours: 1.5, semester: 'W', courseNumber: '220.043' },
      { id: 'wasser-boden', name: 'Modellierung von Wasser im Boden', type: 'VU', ects: 3, hours: 2.5 }
    ]
  }
};
