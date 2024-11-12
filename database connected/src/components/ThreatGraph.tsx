import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import type { AnomalyDetectionResult } from '../types';

interface ThreatGraphProps {
  results: AnomalyDetectionResult[];
}

export function ThreatGraph({ results }: ThreatGraphProps) {
  const data = results.map(result => ({
    timestamp: format(result.timestamp, 'HH:mm:ss'),
    confidence: result.confidence * 100,
    isAnomaly: result.isAnomaly ? 100 : 0,
  }));

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Threat Detection Timeline</h2>
      <div className="w-full overflow-x-auto">
        <LineChart width={600} height={300} data={data.reverse()} className="text-gray-300">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="timestamp" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              color: '#E5E7EB'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="confidence" 
            stroke="#3B82F6" 
            name="Confidence Score"
          />
          <Line 
            type="monotone" 
            dataKey="isAnomaly" 
            stroke="#EF4444" 
            name="Anomaly Detected"
          />
        </LineChart>
      </div>
    </div>
  );
}