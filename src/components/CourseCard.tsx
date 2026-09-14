'use client';

import { Course } from '@/data/types';

interface CourseCardProps {
  course: Course;
  selected: boolean;
  onToggle: (courseId: string) => void;
  disabled?: boolean;
}

export default function CourseCard({ course, selected, onToggle, disabled }: CourseCardProps) {
  return (
    <div
      className={`course-card cursor-pointer ${selected ? 'selected' : 'bg-white border-gray-200'} ${disabled ? 'opacity-50' : ''} ${course.cancelled ? 'opacity-50 line-through' : ''}`}
      onClick={() => !disabled && !course.cancelled && onToggle(course.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`course-type-badge type-${course.type}`}>
              {course.type}
            </span>
            {course.semester && (
              <span className={`semester-badge semester-${course.semester}`}>
                {course.semester === 'W' ? 'WS' : course.semester === 'S' ? 'SS' : 'WS/SS'}
              </span>
            )}
            {course.cancelled && (
              <span className="text-xs text-red-600 font-medium">abgesagt</span>
            )}
          </div>
          <h4 className="font-medium text-gray-900 text-sm leading-tight">
            {course.name}
          </h4>
          {course.courseNumber && (
            <p className="text-xs text-gray-500 mt-0.5">{course.courseNumber}</p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-tuwien-blue">{course.ects}</span>
          <span className="text-xs text-gray-500">ECTS</span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">{course.hours} SWS</span>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => {}}
          disabled={disabled || course.cancelled}
          className="w-4 h-4 text-tuwien-blue rounded border-gray-300 focus:ring-tuwien-blue"
        />
      </div>
    </div>
  );
}
