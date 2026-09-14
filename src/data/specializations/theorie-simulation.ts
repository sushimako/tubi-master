import { Specialization } from '../types';

export const theorieSimulationSpecialization: Specialization = {
  id: 'ki-ts',
  name: 'Konstruktiver Ingenieurbau - Theorie und Simulation',
  shortName: 'TS',
  m1: {
    id: 'm1-ts',
    name: 'Masterspezifische Ausbildung Konstruktiver Ingenieurbau - Theorie und Simulation',
    shortName: 'M1 TS',
    requiredEcts: 12,
    courses: [
      { id: '206.301', name: 'Baudynamik', type: 'VO', ects: 4, hours: 2.5, semester: 'S', courseNumber: '206.301' },
      { id: '206.289', name: 'Bauphysik - Hygrothermische Bauteilanalyse', type: 'VU', ects: 4, hours: 3, semester: 'W', courseNumber: '206.289' },
      { id: '202.068', name: 'Baustatik 2', type: 'VU', ects: 4, hours: 3, semester: 'W', courseNumber: '202.068' },
      { id: '202.653', name: 'Finite Elemente Methoden', type: 'VU', ects: 4, hours: 3, semester: 'W', courseNumber: '202.653' }
    ]
  },
  m2: {
    id: 'm2-ts',
    name: 'Vertiefende Ausbildung Konstruktiver Ingenieurbau - Theorie und Simulation',
    shortName: 'M2 TS',
    requiredEcts: 16,
    courses: [
      { id: '206.051', name: 'Baulicher Brandschutz', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '206.051' },
      { id: 'bauphysik-gebaeude', name: 'Bauphysik - Gebäudeanalyse', type: 'VU', ects: 5, hours: 4, semester: 'S' },
      { id: 'baustatik-software', name: 'Baustatik-Software', type: 'VU', ects: 1.5, hours: 1 },
      { id: '202.660', name: 'Finite Elemente Methoden 2', type: 'VU', ects: 4, hours: 3, semester: 'S', courseNumber: '202.660' },
      { id: '202.658', name: 'Flächentragwerke Theorie', type: 'VU', ects: 4, hours: 3, semester: 'S', courseNumber: '202.658' },
      { id: '104.391', name: 'Mathematik 3 für BI', type: 'VU', ects: 4, hours: 3, semester: 'W', courseNumber: '104.391' },
      { id: '206.299', name: 'Messtechnische Verfahren in der Baudynamik', type: 'VU', ects: 3, hours: 2.5, semester: 'W', courseNumber: '206.299' },
      { id: '212.010-ts', name: 'Modellbildung und Berechnung im Betonbau', type: 'VO', ects: 2.5, hours: 1.5, semester: 'W' },
      { id: 'numerische-baudynamik', name: 'Numerische Methoden in der Baudynamik', type: 'VU', ects: 2, hours: 1.5 },
      { id: '206.290', name: 'Schallschutz und Akustik', type: 'VU', ects: 3, hours: 2, semester: 'W', courseNumber: '206.290' },
      { id: 'software-konstruktiv', name: 'Softwareeinsatz im konstruktiven Ingenieurbau', type: 'SE', ects: 2, hours: 2 },
      { id: 'strukturoptimierung', name: 'Strukturoptimierung', type: 'VO', ects: 3, hours: 2 },
      { id: '206.336', name: 'Projektarbeit Theorie und Simulation - Bauphysik und Schallschutz', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '206.336' },
      { id: '206.337', name: 'Projektarbeit Theorie und Simulation - Baumechanik', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '206.337' },
      { id: '242.032', name: 'Projektarbeit Theorie und Simulation - Computerunterstützte Anwendungen im Bauingenieurwesen', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '242.032' },
      { id: '202.669', name: 'Projektarbeit Theorie und Simulation - Festigkeitslehre und Numerische Mechanik', type: 'PA', ects: 6, hours: 6, semester: 'S', courseNumber: '202.669' },
      { id: '202.670', name: 'Projektarbeit Theorie und Simulation - Werkstoff- und Struktursimulation', type: 'PA', ects: 6, hours: 6, semester: 'S', courseNumber: '202.670' },
      { id: '206.339', name: 'Projektarbeit Theorie und Simulation - Baustofflehre, Werkstofftechnologie und Brandsicherheit', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '206.339' },
      { id: '212.470', name: 'Projektarbeit Theorie und Simulation - Stahlbeton- und Massivbau', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '212.470' },
      { id: '207.001', name: 'Projektarbeit Theorie und Simulation - Ökologische Bautechnologien', type: 'PR', ects: 6, hours: 6, semester: 'WS', courseNumber: '207.001' }
    ]
  }
};
