import React from 'react';
import type { ThreatData } from '../types';

interface ThreatMapProps {
  threats: ThreatData[];
}

export function ThreatMap({ threats }: ThreatMapProps) {
  const threatsBySource = threats.reduce((acc, threat) => {
    acc[threat.source] = (acc[threat.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Threat Sources</h2>
      <div className="space-y-2">
        {Object.entries(threatsBySource).map(([source, count]) => (
          <div key={source} className="flex items-center justify-between">
            <span className="text-gray-300">{source}</span>
            <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded">
              {count} threats
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}