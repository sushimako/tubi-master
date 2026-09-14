'use client';

import { useState } from 'react';

interface CategoryProgress {
  name: string;
  shortName: string;
  current: number;
  required: number;
}

interface ProgressOverviewProps {
  categories: CategoryProgress[];
  totalCurrent: number;
  totalRequired: number;
}

// Helper to render a number with smaller decimals
// reserveDecimal: if true, reserves space for decimals even when the number is whole
function renderNumber(num: number, smallerDecimalClass: string = 'text-[0.7em]', reserveDecimal: boolean = false) {
  const str = String(num);
  const dotIndex = str.indexOf('.');
  if (dotIndex === -1) {
    // No decimal
    if (reserveDecimal) {
      // Reserve space for decimal to keep alignment
      return <>{str}<span className={`${smallerDecimalClass} invisible`}>.0</span></>;
    }
    return <>{str}</>;
  }
  const intPart = str.substring(0, dotIndex);
  const decPart = str.substring(dotIndex);
  return (
    <>
      {intPart}<span className={smallerDecimalClass}>{decPart}</span>
    </>
  );
}

export default function ProgressOverview({ categories, totalCurrent, totalRequired }: ProgressOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check which categories are not fulfilled
  const unfulfilledCategories = categories.filter(cat => cat.current < cat.required);
  const allCategoriesFulfilled = unfulfilledCategories.length === 0;
  const totalEctsFulfilled = totalCurrent >= totalRequired;
  const isComplete = allCategoriesFulfilled && totalEctsFulfilled;

  return (
    <>
      {/* Desktop version - always visible in sidebar */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 py-6 px-10">
        {/* Total Progress */}
        <div className={`mb-6 p-4 rounded-lg ${isComplete ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-tuwien-blue to-tuwien-dark'}`}>
          <div className="flex justify-between items-center text-white mb-2">
            <span className="font-medium">Gesamt</span>
            <span className="text-xl font-bold whitespace-nowrap">
              {totalCurrent} / {totalRequired} ECTS
            </span>
          </div>
          <div className="progress-bar bg-white/20">
            <div
              className={`progress-bar-fill ${isComplete ? 'progress-complete' : 'bg-white/80'}`}
              style={{ width: `${Math.min((totalCurrent / totalRequired) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Category Progress */}
        <div className="space-y-4">
          {categories.map((cat) => {
            const percent = Math.min((cat.current / cat.required) * 100, 100);
            const isCatComplete = cat.current >= cat.required;
            const isOver = cat.current > cat.required;
            
            return (
              <div key={cat.shortName}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700" title={cat.name}>
                    {cat.shortName}
                  </span>
                  <span className={`text-sm font-bold ${isCatComplete ? 'text-green-600' : 'text-gray-600'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <span className="inline-flex items-baseline">
                      <span className="w-7 text-right inline-block">{renderNumber(cat.current)}</span>
                      <span className="w-2 text-center inline-block">/</span>
                      <span className="w-7 text-right inline-block relative">
                        {renderNumber(cat.required, 'text-[0.7em]', true)}
                        {isOver && <sup className="text-orange-500 text-xs absolute left-full top-0 ml-0.5 whitespace-nowrap">+{(cat.current - cat.required).toFixed(1).replace(/\.0$/, '')}</sup>}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-bar-fill ${isCatComplete ? 'progress-complete' : 'progress-partial'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile version - sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        {/* Collapsed view - always visible */}
        <div 
          className={`p-3 cursor-pointer ${isComplete ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-tuwien-blue to-tuwien-dark'}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">ECTS</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full ${isComplete ? 'bg-white' : 'bg-white/80'}`}
                  style={{ width: `${Math.min((totalCurrent / totalRequired) * 100, 100)}%` }}
                />
              </div>
              <span className="text-lg font-bold whitespace-nowrap">
                {totalCurrent}/{totalRequired}
              </span>
            </div>
          </div>
        </div>
        
        {/* Expanded view - category breakdown */}
        {isExpanded && (
          <div className="p-3 pr-6 bg-white max-h-64 overflow-y-auto">
            <div className="space-y-3">
              {categories.map((cat) => {
                const percent = Math.min((cat.current / cat.required) * 100, 100);
                const isCatComplete = cat.current >= cat.required;
                const isOver = cat.current > cat.required;
                
                return (
                  <div key={cat.shortName}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700" title={cat.name}>
                        {cat.shortName}
                      </span>
                      <span className={`text-xs font-bold ${isCatComplete ? 'text-green-600' : 'text-gray-600'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                        <span className="inline-flex items-baseline">
                          <span className="w-6 text-right inline-block">{renderNumber(cat.current, 'text-[0.7em]')}</span>
                          <span className="w-2 text-center inline-block">/</span>
                          <span className="w-6 text-right inline-block relative">
                            {renderNumber(cat.required, 'text-[0.7em]', true)}
                            {isOver && <sup className="text-orange-500 text-[9px] absolute left-full top-0 ml-0.5 whitespace-nowrap">+{(cat.current - cat.required).toFixed(1).replace(/\.0$/, '')}</sup>}
                          </span>
                        </span>
                      </span>
                    </div>
                    <div className="progress-bar h-1.5">
                      <div
                        className={`progress-bar-fill ${isCatComplete ? 'progress-complete' : 'progress-partial'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Spacer for mobile to prevent content being hidden behind sticky bar */}
      <div className="lg:hidden h-16" />
    </>
  );
}
