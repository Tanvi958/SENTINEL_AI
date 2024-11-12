import React from 'react';
import type { AnomalyDetectionResult } from '../types';

interface ThreatListProps {
  results: AnomalyDetectionResult[];
}

export function ThreatList({ results }: ThreatListProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Recent Threats</h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              result.isAnomaly ? 'bg-red-900/50' : 'bg-green-900/50'
            } border ${
              result.isAnomaly ? 'border-red-700' : 'border-green-700'
            }`}
          >
            <div className="font-semibold text-gray-100">
              {result.isAnomaly ? '⚠️ Anomaly Detected' : '✅ Normal Activity'}
            </div>
            <div className="text-sm text-gray-300">
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-300">{result.details}</div>
            <div className="text-xs text-gray-400">
              {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}