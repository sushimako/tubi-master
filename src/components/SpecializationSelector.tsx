'use client';

import { Specialization } from '@/data/types';

interface SpecializationSelectorProps {
  specializations: Specialization[];
  selected1: string | null;
  selected2: string | null;
  onSelect: (slot: 1 | 2, specializationId: string | null) => void;
}

export default function SpecializationSelector({
  specializations,
  selected1,
  selected2,
  onSelect
}: SpecializationSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6 overflow-hidden">
      <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">
        Vertiefungsrichtungen
      </h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 hidden sm:block">
        Wähle zwei der sechs Vertiefungsrichtungen. Jede besteht aus M1 (Masterspezifische Ausbildung, 12 ECTS) 
        und M2 (Vertiefende Ausbildung, 16 ECTS). Überschüssige ECTS können für M3 (Ergänzende Ausbildung) angerechnet werden.
      </p>
      
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Specialization 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vertiefungsrichtung 1
          </label>
          <select
            value={selected1 || ''}
            onChange={(e) => onSelect(1, e.target.value || null)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tuwien-blue focus:border-tuwien-blue"
          >
            <option value="">-- Auswählen --</option>
            {specializations.map(spec => (
              <option
                key={spec.id}
                value={spec.id}
                disabled={spec.id === selected2}
              >
                {spec.name} ({spec.shortName})
              </option>
            ))}
          </select>
        </div>
        
        {/* Specialization 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vertiefungsrichtung 2
          </label>
          <select
            value={selected2 || ''}
            onChange={(e) => onSelect(2, e.target.value || null)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tuwien-blue focus:border-tuwien-blue"
          >
            <option value="">-- Auswählen --</option>
            {specializations.map(spec => (
              <option
                key={spec.id}
                value={spec.id}
                disabled={spec.id === selected1}
              >
                {spec.name} ({spec.shortName})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
