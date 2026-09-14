'use client';

import { useState, useEffect, useMemo } from 'react';
import { curriculum, transferableSkillsModule } from '@/data/curriculum';
import { SelectedCourses, UserSelection } from '@/data/types';
import SpecializationSelector from '@/components/SpecializationSelector';
import ModuleSection from '@/components/ModuleSection';
import ProgressOverview from '@/components/ProgressOverview';

const STORAGE_KEY = 'tuwien-curriculum-selection';

export default function Home() {
  const [selection, setSelection] = useState<UserSelection>({
    specialization1: null,
    specialization2: null,
    courses: {}
  });
  
  const [loaded, setLoaded] = useState(false);
  const [semesterFilter, setSemesterFilter] = useState<'all' | 'W' | 'S'>('all');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Get default selections (interdisciplinary courses pre-selected)
  const getDefaultCourses = (): SelectedCourses => {
    const defaults: SelectedCourses = {};
    curriculum.interdisciplinary.courses.forEach(course => {
      defaults[course.id] = true;
    });
    return defaults;
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure interdisciplinary courses are selected
        const defaultCourses = getDefaultCourses();
        setSelection({
          ...parsed,
          courses: { ...defaultCourses, ...parsed.courses }
        });
      } catch (e) {
        console.error('Failed to load saved selection');
        setSelection(prev => ({
          ...prev,
          courses: getDefaultCourses()
        }));
      }
    } else {
      // No saved data, use defaults
      setSelection(prev => ({
        ...prev,
        courses: getDefaultCourses()
      }));
    }
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    }
  }, [selection, loaded]);

  const handleSpecializationSelect = (slot: 1 | 2, specId: string | null) => {
    setSelection(prev => ({
      ...prev,
      [slot === 1 ? 'specialization1' : 'specialization2']: specId
    }));
  };

  const handleToggleCourse = (courseId: string) => {
    setSelection(prev => ({
      ...prev,
      courses: {
        ...prev.courses,
        [courseId]: !prev.courses[courseId]
      }
    }));
  };

  // Get selected specializations
  const spec1 = curriculum.specializations.find(s => s.id === selection.specialization1);
  const spec2 = curriculum.specializations.find(s => s.id === selection.specialization2);

  // Get non-selected specializations for M3 pool
  const nonSelectedSpecs = curriculum.specializations.filter(
    s => s.id !== selection.specialization1 && s.id !== selection.specialization2
  );

  // Create a virtual module for "Weitere M3 LVAs" containing all M1/M2 courses from non-selected specs
  const weitereM3Module = useMemo(() => {
    const allCourses = nonSelectedSpecs.flatMap(spec => [
      ...spec.m1.courses,
      ...spec.m2.courses
    ]);
    
    // Calculate how many ECTS are selected from these courses
    const selectedEcts = allCourses
      .filter(c => selection.courses[c.id])
      .reduce((sum, c) => sum + c.ects, 0);

    return {
      id: 'weitere-m3',
      name: 'Weitere M3 LVAs',
      shortName: 'M3+',
      requiredEcts: 15, // M3 requires 15 ECTS total
      courses: allCourses
    };
  }, [nonSelectedSpecs, selection.courses]);

  // Calculate ECTS for each category
  const calculateModuleEcts = (courses: typeof curriculum.interdisciplinary.courses) => {
    return courses
      .filter(c => selection.courses[c.id])
      .reduce((sum, c) => sum + c.ects, 0);
  };

  const ectsBreakdown = useMemo(() => {
    const interdisciplinaryEcts = calculateModuleEcts(curriculum.interdisciplinary.courses);
    
    const spec1M1Ects = spec1 ? calculateModuleEcts(spec1.m1.courses) : 0;
    const spec1M2Ects = spec1 ? calculateModuleEcts(spec1.m2.courses) : 0;
    const spec2M1Ects = spec2 ? calculateModuleEcts(spec2.m1.courses) : 0;
    const spec2M2Ects = spec2 ? calculateModuleEcts(spec2.m2.courses) : 0;
    
    const electivesEcts = calculateModuleEcts(curriculum.electives.courses);
    const transferableSkillsEcts = calculateModuleEcts(transferableSkillsModule.courses);
    const totalElectivesEcts = electivesEcts + transferableSkillsEcts;
    
    // Calculate overflow from each M1/M2 module individually
    const spec1M1Overflow = Math.max(0, spec1M1Ects - 12);
    const spec1M2Overflow = Math.max(0, spec1M2Ects - 16);
    const spec2M1Overflow = Math.max(0, spec2M1Ects - 12);
    const spec2M2Overflow = Math.max(0, spec2M2Ects - 16);
    
    // ECTS from non-selected specializations count directly towards M3
    const weitereM3Ects = calculateModuleEcts(weitereM3Module.courses);
    
    // Total overflow + weitere M3 counts towards M3
    const totalOverflow = spec1M1Overflow + spec1M2Overflow + spec2M1Overflow + spec2M2Overflow;
    const m3Current = totalOverflow + weitereM3Ects;
    const m3Required = 15;
    
    return {
      interdisciplinary: { current: interdisciplinaryEcts, required: 10 },
      spec1M1: { current: spec1M1Ects, required: 12 },
      spec1M2: { current: spec1M2Ects, required: 16 },
      spec2M1: { current: spec2M1Ects, required: 12 },
      spec2M2: { current: spec2M2Ects, required: 16 },
      m3: { current: m3Current, required: m3Required },
      transferableSkills: { current: transferableSkillsEcts, required: 4.5 },
      electives: { current: totalElectivesEcts, required: 9 },
      thesis: { current: 30, required: 30 }
    };
  }, [selection, spec1, spec2, weitereM3Module]);

  // Calculate weitere M3 ECTS (courses from non-selected specializations)
  const weitereM3Ects = useMemo(() => {
    return weitereM3Module.courses
      .filter(c => selection.courses[c.id])
      .reduce((sum, c) => sum + c.ects, 0);
  }, [weitereM3Module.courses, selection.courses]);

  // Note: M3 overflow is already counted in M1/M2 totals, so don't add it separately
  // But we do need to add weitere M3 ECTS (from non-selected specs)
  const totalEcts = 
    ectsBreakdown.interdisciplinary.current +
    ectsBreakdown.spec1M1.current +
    ectsBreakdown.spec1M2.current +
    ectsBreakdown.spec2M1.current +
    ectsBreakdown.spec2M2.current +
    weitereM3Ects +
    ectsBreakdown.electives.current +
    ectsBreakdown.thesis.current;

  const progressCategories = [
    { name: 'Interdisziplinäre Ausbildung', shortName: 'IA', ...ectsBreakdown.interdisciplinary },
    ...(spec1 ? [
      { name: spec1.m1.name, shortName: spec1.m1.shortName, ...ectsBreakdown.spec1M1 },
      { name: spec1.m2.name, shortName: spec1.m2.shortName, ...ectsBreakdown.spec1M2 },
    ] : []),
    ...(spec2 ? [
      { name: spec2.m1.name, shortName: spec2.m1.shortName, ...ectsBreakdown.spec2M1 },
      { name: spec2.m2.name, shortName: spec2.m2.shortName, ...ectsBreakdown.spec2M2 },
    ] : []),
    { name: 'Ergänzende Ausbildung (M3)', shortName: 'M3', ...ectsBreakdown.m3 },
    { name: 'Transferable Skills (min.)', shortName: 'TS', ...ectsBreakdown.transferableSkills },
    { name: 'Freie Wahlfächer + TS', shortName: 'FW+TS', ...ectsBreakdown.electives },
    { name: 'Diplomarbeit', shortName: 'DA', ...ectsBreakdown.thesis },
  ];

  const handleReset = () => {
    if (confirm('Möchtest du wirklich alle Auswahlen zurücksetzen?')) {
      setSelection({ specialization1: null, specialization2: null, courses: getDefaultCourses() });
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tuwien-blue"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-tuwien-blue to-tuwien-dark text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Curriculum Planner
          </h1>
          <p className="text-white/80 text-lg">
            TU Wien Masterstudium: Bauingenieurwissenschaften
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-8 items-start">
          {/* Main Content */}
          <div className="space-y-4 sm:space-y-8 min-w-0">
            {/* Specialization Selector */}
            <SpecializationSelector
              specializations={curriculum.specializations}
              selected1={selection.specialization1}
              selected2={selection.specialization2}
              onSelect={handleSpecializationSelect}
            />

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className="text-sm font-medium text-gray-700">Semester:</span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setSemesterFilter('all')}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                        semesterFilter === 'all'
                          ? 'bg-tuwien-blue text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Alle
                    </button>
                    <button
                      onClick={() => setSemesterFilter('W')}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                        semesterFilter === 'W'
                          ? 'bg-tuwien-blue text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      WS
                    </button>
                    <button
                      onClick={() => setSemesterFilter('S')}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                        semesterFilter === 'S'
                          ? 'bg-tuwien-blue text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      SS
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSelectedOnly}
                      onChange={(e) => setShowSelectedOnly(e.target.checked)}
                      className="w-4 h-4 text-tuwien-blue rounded border-gray-300 focus:ring-tuwien-blue"
                    />
                    <span className="text-sm font-medium text-gray-700">Nur ausgewählte</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Interdisciplinary Module */}
            <ModuleSection
              module={curriculum.interdisciplinary}
              selectedCourses={selection.courses}
              onToggleCourse={handleToggleCourse}
              semesterFilter={semesterFilter}
              showSelectedOnly={showSelectedOnly}
            />

            {/* Specialization 1 */}
            {spec1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                  {spec1.name}
                </h2>
                <ModuleSection
                  module={spec1.m1}
                  selectedCourses={selection.courses}
                  onToggleCourse={handleToggleCourse}
                  semesterFilter={semesterFilter}
                  showSelectedOnly={showSelectedOnly}
                />
                <ModuleSection
                  module={spec1.m2}
                  selectedCourses={selection.courses}
                  onToggleCourse={handleToggleCourse}
                  semesterFilter={semesterFilter}
                  showSelectedOnly={showSelectedOnly}
                />
              </div>
            )}

            {/* Specialization 2 */}
            {spec2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                  {spec2.name}
                </h2>
                <ModuleSection
                  module={spec2.m1}
                  selectedCourses={selection.courses}
                  onToggleCourse={handleToggleCourse}
                  semesterFilter={semesterFilter}
                  showSelectedOnly={showSelectedOnly}
                />
                <ModuleSection
                  module={spec2.m2}
                  selectedCourses={selection.courses}
                  onToggleCourse={handleToggleCourse}
                  semesterFilter={semesterFilter}
                  showSelectedOnly={showSelectedOnly}
                />
              </div>
            )}

            {/* Weitere M3 LVAs - courses from non-selected specializations */}
            {(spec1 || spec2) && nonSelectedSpecs.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                  Ergänzende Ausbildung M3 (15 ECTS)
                </h2>
                <p className="text-sm text-gray-600">
                  LVAs aus den nicht gewählten Vertiefungsrichtungen können für M3 angerechnet werden.
                </p>
                {nonSelectedSpecs.map(spec => {
                  const combinedModule = {
                    id: `m3-${spec.id}`,
                    name: spec.name,
                    shortName: spec.shortName,
                    requiredEcts: 0,
                    courses: [...spec.m1.courses, ...spec.m2.courses]
                  };
                  return (
                    <ModuleSection
                      key={spec.id}
                      module={combinedModule}
                      selectedCourses={selection.courses}
                      onToggleCourse={handleToggleCourse}
                      semesterFilter={semesterFilter}
                      showSelectedOnly={showSelectedOnly}
                      showProgress={false}
                    />
                  );
                })}
              </div>
            )}

            {/* Transferable Skills */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                Freie Wahlfächer und Transferable Skills (9 ECTS)
              </h2>
              <p className="text-sm text-gray-600">
                Mindestens 4.5 ECTS müssen aus dem Transferable Skills Katalog gewählt werden.
              </p>
              <ModuleSection
                module={transferableSkillsModule}
                selectedCourses={selection.courses}
                onToggleCourse={handleToggleCourse}
                semesterFilter={semesterFilter}
                showSelectedOnly={showSelectedOnly}
              />
              <ModuleSection
                module={curriculum.electives}
                selectedCourses={selection.courses}
                onToggleCourse={handleToggleCourse}
                semesterFilter={semesterFilter}
                showSelectedOnly={showSelectedOnly}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-4 space-y-4">
            <ProgressOverview
              categories={progressCategories}
              totalCurrent={totalEcts}
              totalRequired={120}
            />
            
            <button
              onClick={handleReset}
              className="hidden lg:block w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
            >
              Auswahl zurücksetzen
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-12 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>Basierend auf dem Studienplan 2025 (Studienplannovelle 2017U)</p>
          <p className="mt-1">Keine offizielle TU Wien Anwendung</p>
        </div>
      </footer>
    </main>
  );
}
