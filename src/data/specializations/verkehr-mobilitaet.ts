import { Specialization } from '../types';

export const verkehrMobilitaetSpecialization: Specialization = {
  id: 'vm',
  name: 'Verkehr & Mobilität',
  shortName: 'VM',
  m1: {
    id: 'm1-vm',
    name: 'Masterspezifische Ausbildung Verkehr & Mobilität',
    shortName: 'M1 VM',
    requiredEcts: 12,
    courses: [
      { id: '230.037', name: 'Transport- und Siedlungswesen', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '230.037' },
      { id: '230.038', name: 'Verkehrsträger- und Mobilitätsmanagement', type: 'VO', ects: 2, hours: 1.5, semester: 'W', courseNumber: '230.038' },
      { id: '230.039', name: 'Eisenbahnwesen 2', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '230.039' },
      { id: 'verkehrswirtschaft', name: 'Verkehrswirtschaft', type: 'VO', ects: 1.5, hours: 1.5 },
      { id: 'strassenbau-erhaltung', name: 'Straßenbau und Straßenerhaltung', type: 'VO', ects: 2, hours: 2 },
      { id: '230.041', name: 'Straßenplanung und Umweltschutz', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '230.041' }
    ]
  },
  m2: {
    id: 'm2-vm',
    name: 'Vertiefende Ausbildung Verkehr & Mobilität',
    shortName: 'M2 VM',
    requiredEcts: 16,
    courses: [
      { id: 'umwelthygiene', name: 'Umwelthygiene', type: 'VO', ects: 2, hours: 2 },
      { id: '231.028', name: 'Methoden und Modelle in der Siedlungs- und Verkehrsplanung', type: 'VU', ects: 3, hours: 2, semester: 'W', courseNumber: '231.028' },
      { id: '231.440', name: 'Raumplanung und Raumordnung', type: 'VO', ects: 2, hours: 1.5, semester: 'W', courseNumber: '231.440' },
      { id: '230.042', name: 'National and European Transport Policies', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '230.042' },
      { id: '230.043', name: 'Transport- und Siedlungswesen', type: 'UE', ects: 2, hours: 2, semester: 'W', courseNumber: '230.043' },
      { id: 'bahnerhaltung', name: 'Bahnerhaltung', type: 'VO', ects: 1.5, hours: 1.5 },
      { id: 'seilbahnen', name: 'Seilbahnen', type: 'VU', ects: 2.5, hours: 2.5 },
      { id: '232.029', name: 'Bahnsimulation', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '232.029' },
      { id: '230.026', name: 'Public Transport', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '230.026' },
      { id: '232.032', name: 'Öffentlicher Personennahverkehr', type: 'VO', ects: 2, hours: 1.5, semester: 'W', courseNumber: '232.032' },
      { id: 'spurfuehrung', name: 'Spurführungstechnik', type: 'VO', ects: 1.5, hours: 1.5 },
      { id: '230.023', name: 'Flugbetriebsflächen', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '230.023' },
      { id: 'road-pavement', name: 'Road Pavement Materials', type: 'VO', ects: 2, hours: 2 },
      { id: 'pavement-design', name: 'Pavement Design and Modelling', type: 'VO', ects: 2, hours: 2 },
      { id: '230.046', name: 'Straßenbautechnisches Laborpraktikum', type: 'LU', ects: 4, hours: 3, semester: 'W', courseNumber: '230.046' },
      { id: '230.034', name: 'Projektarbeit Verkehr und Mobilität - Verkehrsplanung und Verkehrstechnik', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '230.034' },
      { id: '230.035', name: 'Projektarbeit Verkehr und Mobilität - Eisenbahnwesen und Verkehrswirtschaft', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '230.035' },
      { id: '230.036', name: 'Projektarbeit Verkehr und Mobilität - Straßenwesen', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '230.036' }
    ]
  }
};
