import { Module } from './types';

export const interdisciplinaryModule: Module = {
  id: 'interdisciplinary',
  name: 'Interdisziplinäre Ausbildung',
  shortName: 'IA',
  requiredEcts: 10,
  courses: [
    {
      id: '202.666',
      name: 'Ingenieurmechanik',
      type: 'VU',
      ects: 4,
      hours: 3,
      semester: 'S',
      courseNumber: '202.666'
    },
    {
      id: 'planungsprozesse-bim',
      name: 'Planungsprozesse mit BIM',
      type: 'VU',
      ects: 3,
      hours: 2.5,
      semester: 'WS'
    },
    {
      id: '235.042',
      name: 'Risikobewertung im Bauingenieurwesen',
      type: 'VU',
      ects: 3,
      hours: 2.5,
      semester: 'W',
      courseNumber: '235.042'
    }
  ]
};
