import { Course } from './types';

// Freie Wahlfächer und Transferable Skills - All courses with links from TISS
// Min 4.5 ECTS must be from Transferable Skills

export const electiveCourses: Course[] = [
  // Facheinschlägige Praxis
  { id: '200.267', name: 'Facheinschlägige Praxis', type: 'SE', ects: 5, hours: 5, semester: 'W', courseNumber: '200.267' },
  
  // 1 ECTS Courses
  { id: '225.008', name: 'Abfallwirtschaft Exkursion 1', type: 'EX', ects: 1, hours: 1, semester: 'W', courseNumber: '225.008' },
  { id: '230.018', name: 'Exkursion aus dem Straßenbau', type: 'EX', ects: 1, hours: 1, semester: 'W', courseNumber: '230.018' },
  { id: '210.013', name: 'Gebaute Beispiele', type: 'SE', ects: 1, hours: 1, semester: 'W', courseNumber: '210.013' },
  { id: '226.039', name: 'Seminarreihe Wassergütewirtschaft', type: 'SE', ects: 1, hours: 1, semester: 'W', courseNumber: '226.039' },
  { id: '234.986', name: 'Seminar mit Exkursionen aus dem aktuellen Baubetrieb', type: 'SE', ects: 1, hours: 1, semester: 'W', courseNumber: '234.986' },
  { id: '226.061', name: 'Exkursion zur Vorlesung Trinkwasserversorgung', type: 'EX', ects: 1, hours: 1, semester: 'S', courseNumber: '226.061' },
  { id: '220.038', name: 'Exkursion Fels- und Tunnelbau', type: 'EX', ects: 1, hours: 1, semester: 'W', courseNumber: '220.038' },
  { id: '202.071', name: 'Exkursion Holzbau', type: 'EX', ects: 1, hours: 1, semester: 'W', courseNumber: '202.071' },
  { id: '210.022', name: 'Exkursion Hochbau', type: 'EX', ects: 1, hours: 1, semester: 'W', courseNumber: '210.022' },
  { id: '212.042', name: 'Computergestützte Analyse von Betontragwerken', type: 'SE', ects: 1, hours: 1, semester: 'W', courseNumber: '212.042' },
  
  // 1.5 ECTS Courses
  { id: '212.023', name: 'Besondere Spannungs- und Stabilitätsprobleme im Stahlbau', type: 'VO', ects: 1.5, hours: 1, semester: 'S', courseNumber: '212.023' },
  
  // 2 ECTS Courses
  { id: '202.024', name: 'Engineering Biochemoporomechanics', type: 'UE', ects: 2, hours: 2, semester: 'S', courseNumber: '202.024' },
  { id: '226.048', name: 'Ecology', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '226.048' },
  { id: '231.001', name: 'Seminar zur Verkehrsplanung', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '231.001' },
  { id: '232.005', name: 'Hochleistungsbahnsysteme', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '232.005' },
  { id: '232.010', name: 'ÖPNV', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '232.010' },
  { id: '232.016', name: 'Verkehrswirtschaft', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '232.016' },
  { id: '232.035', name: 'Dipl.Sem.Eisenbahnwes.u.Verkehrswirtsch.', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '232.035' },
  { id: '210.014', name: 'Praxisreport: Innovatives Bauen', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '210.014' },
  { id: '225.039', name: 'Diplomandenseminar Ressourcenmanagement', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '225.039' },
  { id: '202.058', name: 'Mechanische Eigenschaften biolog. Gewebe', type: 'LU', ects: 2, hours: 2, semester: 'W', courseNumber: '202.058' },
  { id: '221.016', name: 'Seminar für Diplomanden Grundbau', type: 'SE', ects: 2, hours: 2, semester: 'WS', courseNumber: '221.016' },
  { id: '202.650', name: 'Multiscale Material Modelling', type: 'UE', ects: 2, hours: 2, semester: 'S', courseNumber: '202.650' },
  { id: '201.088', name: 'Physik 1 Aufbaukurs', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '201.088' },
  { id: '201.089', name: 'Mathematik Aufbaukurs', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '201.089' },
  { id: '234.130', name: 'Dissertantenseminar Baubetrieb und Bauverfahrenstechnik', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '234.130' },
  { id: '206.307', name: 'SE Forschungsseminar', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '206.307' },
  { id: '210.015', name: 'Betriebswirtschaftliche Grundlagen der Projektentwicklung für Bauingenieure', type: 'VO', ects: 2, hours: 1.5, semester: 'W', courseNumber: '210.015' },
  { id: '226.049', name: 'Anaerobe Industrieabwasser- und Schlammbehandlung', type: 'VO', ects: 2, hours: 1.5, semester: 'W', courseNumber: '226.049' },
  { id: '226.050', name: 'Advanced Wastewater Treatment and Reuse', type: 'VO', ects: 2, hours: 1.5, semester: 'S', courseNumber: '226.050' },
  { id: '226.052', name: 'Freshwater quality and ecology', type: 'VO', ects: 2, hours: 1.5, semester: 'S', courseNumber: '226.052' },
  { id: '226.053', name: 'Große Vertiefungsexkursion Abwasserreinigung', type: 'EX', ects: 2, hours: 2, semester: 'S', courseNumber: '226.053' },
  { id: '207.002', name: 'Exkursion Ökologische Bautechnologien', type: 'EX', ects: 2, hours: 2, semester: 'WS', courseNumber: '207.002' },
  { id: '330.286', name: 'Industrielle Informationssysteme (UE)', type: 'UE', ects: 2, hours: 2, semester: 'W', courseNumber: '330.286' },
  { id: '210.011', name: 'Parametric Tools for Structural BIM Design', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '210.011' },
  { id: '249.001', name: 'BIMcert - openBIM Zertifizierungskurs', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '249.001' },
  { id: '226.072', name: 'Kanalsanierung', type: 'SE', ects: 2, hours: 2, semester: 'S', courseNumber: '226.072' },
  { id: '210.001', name: 'Multidisziplinäre Planung', type: 'UE', ects: 2, hours: 2, semester: 'W', courseNumber: '210.001' },
  { id: '242.024', name: 'CAD im Hochbau', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '242.024' },
  { id: '242.025', name: 'CAD im Ingenieurbau', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '242.025' },
  { id: '230.067', name: 'Menschenzentrierte Eisenbahnplanung', type: 'VO', ects: 2, hours: 1.5, semester: 'W', courseNumber: '230.067' },
  { id: '210.034', name: 'Mehrtägige Exkursion Hochbau', type: 'EX', ects: 2, hours: 2, semester: 'W', courseNumber: '210.034' },
  { id: '210.035', name: 'Reading Group: Computational Design', type: 'SE', ects: 2, hours: 1.5, semester: 'W', courseNumber: '210.035' },
  { id: '207.024', name: 'Brandrisikomanagement 2', type: 'SE', ects: 2, hours: 2, semester: 'S', courseNumber: '207.024' },
  
  // 2.25 ECTS
  { id: '222.050', name: 'Ausgewählte Kapitel des Konstruktiven Wasserbaus', type: 'VO', ects: 2.25, hours: 1.5, semester: 'W', courseNumber: '222.050' },
  
  // 2.5 ECTS Courses
  { id: '231.028-elec', name: 'Methoden und Modelle in der Siedlungs- und Verkehrsplanung', type: 'VU', ects: 3, hours: 2, semester: 'W', courseNumber: '231.028' },
  { id: '230.001', name: 'Barrierefreie Verkehrsplanung für den öffentlichen Raum', type: 'VU', ects: 2.5, hours: 2, semester: 'W', courseNumber: '230.001' },
  { id: '212.027', name: 'Modellbildung im Stahlbau', type: 'VU', ects: 2.5, hours: 2, semester: 'W', courseNumber: '212.027' },
  { id: '206.320', name: 'Formale Grundlagen des konstruktiven Ingenieurbaus', type: 'VO', ects: 2.5, hours: 1.5, semester: 'W', courseNumber: '206.320' },
  { id: '202.044', name: 'Experimentelle Methoden zur Deformationsanalyse', type: 'VU', ects: 3, hours: 2.5, semester: 'W', courseNumber: '202.044' },
  
  // 3 ECTS Courses
  { id: '206.318', name: 'Metallische Werkstoffe 2', type: 'VO', ects: 3, hours: 2, semester: 'S', courseNumber: '206.318' },
  { id: '202.019', name: 'Engineering biochemoporomechanics', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '202.019' },
  { id: '206.092', name: 'Schweißtechnik mit Exkursion', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '206.092' },
  { id: '222.563', name: 'Bruchmechanik im Massivbau - Rißbildungen in Betonsperren', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '222.563' },
  { id: '222.052', name: 'Selected topics in Hydraulic-and Dam Engineering I', type: 'VO', ects: 3, hours: 2, semester: 'S', courseNumber: '222.052' },
  { id: '202.057', name: 'Mechanische Eigenschaften biolog. Gewebe', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '202.057' },
  { id: '232.038', name: 'Projektseminar Public Transport', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '232.038' },
  { id: '242.016', name: 'Präsentationstechnik I (für BI)', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '242.016' },
  { id: '242.017', name: 'Präsentationstechnik II (für BI)', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '242.017' },
  { id: '202.649', name: 'Multiscale Material Modelling', type: 'VO', ects: 3, hours: 2, semester: 'S', courseNumber: '202.649' },
  { id: '206.272', name: 'Pipelinebau', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '206.272' },
  { id: '206.274', name: 'Schweiß- und Verbindungstechnik 2', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '206.274' },
  { id: '242.026', name: 'Mediative Kompetenz in der Bauwirtschaft 1', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '242.026' },
  { id: '242.031', name: 'Programmieren im Bauingenieurwesen', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '242.031' },
  { id: '206.317', name: 'Schweißtechnische Anwendungen', type: 'SE', ects: 3, hours: 3, semester: 'S', courseNumber: '206.317' },
  { id: '206.319', name: 'Mauerwerksingenieurwesen im Neubau', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '206.319' },
  { id: '206.324', name: 'Altbauten: Charakteristik, Aufnahme und Instandhaltung', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '206.324' },
  { id: '311.160', name: 'Energie- und ressourceneffiziente Produktion – Vertiefung', type: 'VU', ects: 3, hours: 2, semester: 'S', courseNumber: '311.160' },
  { id: '330.285', name: 'Industrielle Informationssysteme (VO)', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '330.285' },
  { id: '207.020', name: 'Brandrisikomanagement 1', type: 'SE', ects: 3, hours: 2, semester: 'W', courseNumber: '207.020' },
  { id: '230.056', name: 'Applied system dynamics modelling in transport', type: 'VU', ects: 3, hours: 2, semester: 'W', courseNumber: '230.056' },
  { id: '207.025', name: 'Materialien und Algorithmen', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '207.025' },
  { id: '230.057', name: 'Interdisziplinäres Seminar nachhaltige Mobilität', type: 'SE', ects: 3, hours: 2, semester: 'W', courseNumber: '230.057' },
  { id: '208.004', name: 'Anwendungen der Baudynamik im Hoch- und Brückenbau', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '208.004' },
  { id: '230.060', name: 'Ringvorlesung Ethik und Technik', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '230.060' },
  { id: '311.188', name: 'Energie- und ressourceneffiziente Produktion – Grundlagen', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '311.188' },
  { id: '207.031', name: 'Ökologische Bautechnologien 2', type: 'VU', ects: 3, hours: 2, semester: 'W', courseNumber: '207.031' },
  { id: '230.068', name: 'CAD zur Projektierung von Verkehrswegen', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '230.068' },
  { id: '210.033', name: 'Grundlagen der Gebäudetechnik', type: 'VU', ects: 3, hours: 2, semester: 'W', courseNumber: '210.033' },
  { id: '207.033', name: 'Urban Physics für eine nachhaltig gebaute Umwelt', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '207.033' },
  
  // 4 ECTS Courses
  { id: '206.072', name: 'Schutzgasschweißen', type: 'LU', ects: 4, hours: 4, semester: 'W', courseNumber: '206.072' },
  
  // 4.5 ECTS Courses
  { id: '207.021', name: 'Hybride Bauteile und Verbindungstechnik', type: 'SE', ects: 4.5, hours: 3, semester: 'W', courseNumber: '207.021' },
  { id: '206.174', name: 'Metallische Werkstoffe 1', type: 'VO', ects: 4.5, hours: 3, semester: 'W', courseNumber: '206.174' },
];

// Transferable Skills courses (min 4.5 ECTS required from this category)
export const transferableSkillsCourses: Course[] = [
  { id: '242.016-ts', name: 'Präsentationstechnik I (für BI)', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '242.016' },
  { id: '242.017-ts', name: 'Präsentationstechnik II (für BI)', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '242.017' },
  { id: '242.026-ts', name: 'Mediative Kompetenz in der Bauwirtschaft 1', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '242.026' },
  { id: '242.031-ts', name: 'Programmieren im Bauingenieurwesen', type: 'SE', ects: 3, hours: 3, semester: 'W', courseNumber: '242.031' },
  { id: '249.001-ts', name: 'BIMcert - openBIM Zertifizierungskurs', type: 'SE', ects: 2, hours: 2, semester: 'W', courseNumber: '249.001' },
  { id: '230.060-ts', name: 'Ringvorlesung Ethik und Technik', type: 'VO', ects: 3, hours: 2, semester: 'W', courseNumber: '230.060' },
];
