import { Specialization } from '../types';

export const tragwerkeSpecialization: Specialization = {
  id: 'ki-tw',
  name: 'Konstruktiver Ingenieurbau - Tragwerke',
  shortName: 'TW',
  m1: {
    id: 'm1-tw',
    name: 'Masterspezifische Ausbildung Konstruktiver Ingenieurbau - Tragwerke',
    shortName: 'M1 TW',
    requiredEcts: 12,
    courses: [
      { id: 'betonbau-2', name: 'Betonbau 2', type: 'VU', ects: 4, hours: 3, semester: 'S' },
      { id: '206.101', name: 'Hochbaukonstruktionen 2', type: 'VU', ects: 4, hours: 3, semester: 'W', courseNumber: '206.101' },
      { id: '259.383', name: 'Holzbau 2', type: 'VU', ects: 4, hours: 3, semester: 'S', courseNumber: '259.383' },
      { id: '212.456', name: 'Stahlbau 2', type: 'VU', ects: 4, hours: 3, semester: 'S', courseNumber: '212.456' }
    ]
  },
  m2: {
    id: 'm2-tw',
    name: 'Vertiefende Ausbildung Konstruktiver Ingenieurbau - Tragwerke',
    shortName: 'M2 TW',
    requiredEcts: 16,
    courses: [
      { id: 'advanced-concrete', name: 'Advanced Concrete Engineering', type: 'VU', ects: 5, hours: 4, semester: 'S' },
      { id: '212.461', name: 'Brückenbau', type: 'VU', ects: 5, hours: 4, semester: 'W', courseNumber: '212.461' },
      { id: '212.467', name: 'Betonbrückenbau', type: 'VU', ects: 5, hours: 4, semester: 'W', courseNumber: '212.467' },
      { id: '206.287', name: 'Erhaltung und Erneuerung von Hochbauten', type: 'VU', ects: 4, hours: 3, semester: 'W', courseNumber: '206.287' },
      { id: 'erhaltung-beton', name: 'Erhaltung und Ertüchtigung von Betontragwerken', type: 'VO', ects: 2.5, hours: 1.5 },
      { id: 'hochbau-3', name: 'Hochbaukonstruktionen 3', type: 'VU', ects: 4, hours: 3, semester: 'S' },
      { id: '212.010', name: 'Modellbildung und Berechnung im Betonbau', type: 'VO', ects: 2.5, hours: 1.5, semester: 'W', courseNumber: '212.010' },
      { id: '212.457', name: 'Stahlbau 3', type: 'VU', ects: 5, hours: 4, semester: 'S', courseNumber: '212.457' },
      { id: 'werkstoffe-2', name: 'Werkstoffe im Bauwesen 2', type: 'VO', ects: 4, hours: 2.5 },
      { id: 'werkstoffe-3', name: 'Werkstoffe im Bauwesen 3', type: 'VU', ects: 5, hours: 4 },
      { id: '212.468', name: 'Projektarbeit Tragwerke - Stahlbeton und Massivbau', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '212.468' },
      { id: '212.469', name: 'Projektarbeit Tragwerke - Stahlbau', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '212.469' },
      { id: '202.667', name: 'Projektarbeit Tragwerke - Werkstoff- und Struktursimulation', type: 'PA', ects: 6, hours: 6, semester: 'S', courseNumber: '202.667' },
      { id: '202.668', name: 'Projektarbeit Tragwerke - Festigkeitslehre und Numerische Mechanik', type: 'PA', ects: 6, hours: 6, semester: 'S', courseNumber: '202.668' },
      { id: '206.335', name: 'Projektarbeit Tragwerke - Baustofflehre, Werkstofftechnologie und Brandsicherheit', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '206.335' },
      { id: '206.338', name: 'Projektarbeit Tragwerke - Hochbaukonstruktionen und Gebäudeerhaltung', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '206.338' },
      { id: '259.476', name: 'Projektarbeit Tragwerke - Ressourceneffiziente Tragwerksplanung und Holzbau', type: 'PR', ects: 6, hours: 6, semester: 'W', courseNumber: '259.476' }
    ]
  }
};
