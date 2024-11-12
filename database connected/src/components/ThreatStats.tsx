import React from 'react';
import type { AnomalyDetectionResult } from '../types';

interface ThreatStatsProps {
  results: AnomalyDetectionResult[];
}

export function ThreatStats({ results }: ThreatStatsProps) {
  const totalThreats = results.length;
  const anomalies = results.filter(r => r.isAnomaly).length;
  const avgConfidence = results.reduce((acc, r) => acc + r.confidence, 0) / totalThreats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-blue-400">Total Threats</h3>
        <p className="text-3xl font-bold text-blue-500">{totalThreats}</p>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-blue-400">Anomalies</h3>
        <p className="text-3xl font-bold text-red-500">{anomalies}</p>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-blue-400">Avg Confidence</h3>
        <p className="text-3xl font-bold text-green-500">
          {(avgConfidence * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}