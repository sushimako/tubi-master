import { Specialization } from '../types';

export const bauprozessmanagementSpecialization: Specialization = {
  id: 'bm',
  name: 'Bauprozessmanagement',
  shortName: 'BM',
  m1: {
    id: 'm1-bm',
    name: 'Masterspezifische Ausbildung Bauprozessmanagement',
    shortName: 'M1 BM',
    requiredEcts: 12,
    courses: [
      { id: '234.150', name: 'Bauunternehmensführung und Strategie', type: 'SE', ects: 1.5, hours: 1.5, semester: 'W', courseNumber: '234.150' },
      { id: 'planung-baubetrieb', name: 'Planung und Ausführung des Baubetriebs', type: 'VU', ects: 4, hours: 3 },
      { id: '234.159', name: 'Kalkulation und Kostenrechnung im Baubetrieb', type: 'VU', ects: 4, hours: 3, semester: 'W', courseNumber: '234.159' },
      { id: 'bauwirtschaft-pm-2', name: 'Bauwirtschaft und Projektmanagement 2', type: 'SE', ects: 1.5, hours: 1.5 },
      { id: '210.007', name: 'Industriebau', type: 'VU', ects: 3, hours: 2.5, semester: 'W', courseNumber: '210.007' },
      { id: 'projektentwicklung', name: 'Projektentwicklung', type: 'VO', ects: 2, hours: 1.5 }
    ]
  },
  m2: {
    id: 'm2-bm',
    name: 'Vertiefende Ausbildung Bauprozessmanagement',
    shortName: 'M2 BM',
    requiredEcts: 16,
    courses: [
      { id: '234.151', name: 'Kollaboration in der Baubranche', type: 'SE', ects: 1.5, hours: 1.5, semester: 'W', courseNumber: '234.151' },
      { id: '234.074', name: 'Bauverfahren im Tunnelbau', type: 'VU', ects: 4, hours: 3, semester: 'W', courseNumber: '234.074' },
      { id: '234.153', name: 'Bauverfahren im Hochbau und TGA-Grundlagen', type: 'VU', ects: 3, hours: 2.5, semester: 'W', courseNumber: '234.153' },
      { id: '234.089', name: 'Sicherheit und Umweltschutz auf Baustellen', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '234.089' },
      { id: 'zukunftsfragen', name: 'Zukunftsfragen des Baubetriebs', type: 'SE', ects: 1.5, hours: 1.5 },
      { id: 'icpm', name: 'International Construction Project Management', type: 'SE', ects: 2, hours: 2 },
      { id: 'bauvertraege', name: 'Bauverträge und Vergabe', type: 'SE', ects: 3, hours: 3 },
      { id: 'abweichungsmanagement', name: 'Abweichungsmanagement', type: 'SE', ects: 2, hours: 2 },
      { id: '234.166', name: 'Betriebswirtschaft für Führungskräfte', type: 'VO', ects: 1.5, hours: 1, semester: 'W', courseNumber: '234.166' },
      { id: '234.992', name: 'Bauträger und Immobilienwirtschaft', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '234.992' },
      { id: '234.167', name: 'Öffentliches Recht in der Bauwirtschaft', type: 'SE', ects: 1.5, hours: 1.5, semester: 'W', courseNumber: '234.167' },
      { id: 'arbeitsrecht', name: 'Arbeits- und Sozialrecht in der Bauwirtschaft', type: 'VO', ects: 2, hours: 1.5 },
      { id: 'bauprojektcontrolling', name: 'Bauprojektcontrolling', type: 'SE', ects: 1.5, hours: 1.5 },
      { id: 'kostenrelevanz', name: 'Kostenrelevanz im Planungsprozess', type: 'SE', ects: 2, hours: 2 },
      { id: '210.008', name: 'Integrale Planung', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '210.008' },
      { id: 'lebenszykluskosten', name: 'Lebenszykluskosten und -analyse', type: 'SE', ects: 2, hours: 2 },
      { id: 'industriebauseminar', name: 'Industriebauseminar mit Exkursion', type: 'SE', ects: 2.5, hours: 2.5 },
      { id: '210.009', name: 'Integrated BIM Design Lab', type: 'SE', ects: 8, hours: 8, semester: 'W', courseNumber: '210.009' },
      { id: '234.147', name: 'Projektarbeit Bauprozessmanagement - Baubetrieb und Bauverfahrenstechnik', type: 'PA', ects: 6, hours: 6, semester: 'W', courseNumber: '234.147' },
      { id: '234.148', name: 'Projektarbeit Bauprozessmanagement - Bauwirtschaft und Baumanagement', type: 'PR', ects: 6, hours: 6, semester: 'W', courseNumber: '234.148' },
      { id: '235.731', name: 'Projektarbeit Bauprozessmanagement - Digitaler Bauprozess', type: 'PR', ects: 6, hours: 6, semester: 'W', courseNumber: '235.731' },
      { id: '210.010', name: 'Projektarbeit Bauprozessmanagement - Integrale Planung und Industriebau', type: 'PR', ects: 6, hours: 6, semester: 'W', courseNumber: '210.010' }
    ]
  }
};
