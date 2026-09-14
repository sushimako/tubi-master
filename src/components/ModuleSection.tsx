'use client';

import { Module, SelectedCourses } from '@/data/types';

interface ModuleSectionProps {
  module: Module;
  selectedCourses: SelectedCourses;
  onToggleCourse: (courseId: string) => void;
  showProgress?: boolean;
  semesterFilter?: 'all' | 'W' | 'S';
  showSelectedOnly?: boolean;
}

// Generate TISS URL from course number
function getTissUrl(courseNumber?: string): string | null {
  if (!courseNumber) return null;
  // TISS URL format: https://tiss.tuwien.ac.at/course/courseDetails.xhtml?courseNr=XXXXXX
  // Course number format: XXX.XXX - we need to remove the dot
  const cleanNumber = courseNumber.replace('.', '');
  return `https://tiss.tuwien.ac.at/course/courseDetails.xhtml?courseNr=${cleanNumber}`;
}

export default function ModuleSection({ module, selectedCourses, onToggleCourse, showProgress = true, semesterFilter = 'all', showSelectedOnly = false }: ModuleSectionProps) {
  // Filter courses based on semester and selection
  const filteredCourses = module.courses.filter(course => {
    // Filter by selection first
    if (showSelectedOnly && !selectedCourses[course.id]) return false;
    // Then filter by semester
    if (semesterFilter === 'all') return true;
    if (!course.semester) return true; // Show courses without semester info
    if (course.semester === 'WS') return true; // WS/SS courses always match
    return course.semester === semesterFilter;
  });

  // Hide the entire section if no courses match the filter
  if (filteredCourses.length === 0) return null;

  const selectedEcts = module.courses
    .filter(c => selectedCourses[c.id])
    .reduce((sum, c) => sum + c.ects, 0);
  
  const progressPercent = Math.min((selectedEcts / module.requiredEcts) * 100, 100);
  const isComplete = selectedEcts >= module.requiredEcts;
  const isOver = selectedEcts > module.requiredEcts;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-tuwien-blue to-tuwien-dark">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-sm sm:text-base truncate">{module.name}</h3>
            <p className="text-xs sm:text-sm text-white/80">{module.shortName}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className={`text-xl sm:text-2xl font-bold ${isComplete ? 'text-green-300' : 'text-white'}`}>
              {selectedEcts}
            </span>
            <span className="text-white/70 text-sm">/{module.requiredEcts}</span>
          </div>
        </div>
        {showProgress && (
          <div className="mt-2 progress-bar bg-white/20">
            <div
              className={`progress-bar-fill ${isComplete ? 'progress-complete' : 'bg-white/80'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-2 py-2 text-left w-8"></th>
              <th className="hidden sm:table-cell px-2 py-2 text-center w-14">Sem</th>
              <th className="px-2 py-2 text-left">LVA</th>
              <th className="hidden sm:table-cell px-2 py-2 text-center w-12">Typ</th>
              <th className="px-2 py-2 text-right w-12">ECTS</th>
              <th className="hidden sm:table-cell px-2 py-2 text-center w-12">TISS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCourses.map(course => {
              const tissUrl = getTissUrl(course.courseNumber);
              return (
                <tr
                  key={course.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${selectedCourses[course.id] ? 'bg-tuwien-blue/10' : ''} ${course.cancelled ? 'opacity-50' : ''}`}
                  onClick={() => !course.cancelled && onToggleCourse(course.id)}
                >
                  <td className="px-2 py-2">
                    <input
                      type="checkbox"
                      checked={selectedCourses[course.id] || false}
                      onChange={() => {}}
                      disabled={course.cancelled}
                      className="w-4 h-4 text-tuwien-blue rounded border-gray-300 focus:ring-tuwien-blue"
                    />
                  </td>
                  <td className="hidden sm:table-cell px-2 py-2 text-center whitespace-nowrap">
                    {course.semester && (
                      <span className={`semester-badge semester-${course.semester}`}>
                        {course.semester === 'W' ? 'WS' : course.semester === 'S' ? 'SS' : 'WS/SS'}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2 max-w-0">
                    <div className={`font-medium text-gray-900 text-sm leading-tight truncate ${course.cancelled ? 'line-through' : ''}`}>
                      {course.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {/* Show type badge before course number on mobile */}
                      <span className={`sm:hidden course-type-badge type-${course.type} text-xs`}>
                        {course.type}
                      </span>
                      {course.courseNumber && (
                        <span className="text-xs text-gray-500">{course.courseNumber}</span>
                      )}
                      {/* Show TISS link inline on mobile */}
                      {tissUrl && (
                        <a
                          href={tissUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="sm:hidden text-gray-400 hover:text-tuwien-blue transition-colors"
                          title="Auf TISS öffnen"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                    {course.cancelled && (
                      <span className="text-xs text-red-600 font-medium">abgesagt</span>
                    )}
                  </td>
                  <td className="hidden sm:table-cell px-2 py-2 text-center">
                    <span className={`course-type-badge type-${course.type}`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-right font-semibold text-tuwien-blue">{course.ects}</td>
                  <td className="hidden sm:table-cell px-2 py-2 text-center">
                    {tissUrl && (
                      <a
                        href={tissUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex justify-center text-gray-400 hover:text-tuwien-blue transition-colors"
                        title="Auf TISS öffnen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
