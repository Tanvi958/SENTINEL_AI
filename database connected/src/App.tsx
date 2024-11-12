import React, { useState, useCallback, useEffect } from 'react';
import { SentinelAI } from './core/SentinelAI';
import { ThreatMap } from './components/ThreatMap';
import { ThreatGraph } from './components/ThreatGraph';
import { ThreatStats } from './components/ThreatStats';
import { ThreatList } from './components/ThreatList';
import Chatbot from './chatbot/Chatbot';
import type { ThreatData, AnomalyDetectionResult } from './types';

const sentinel = new SentinelAI();
const THREAT_TYPES = ['malware', 'phishing', 'network'] as const;
const SOURCES = ['endpoint', 'network', 'email', 'web'] as const;

function App() {
  const [results, setResults] = useState<AnomalyDetectionResult[]>([]);
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [loading, setLoading] = useState(false);

  const analyzeThreat = useCallback(async (data: ThreatData) => {
    setLoading(true);
    try {
      const result = await sentinel.analyzeThreat(data);
      setResults(prev => [result, ...prev]);
      setThreats(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error analyzing threat:', error);
    }
    setLoading(false);
  }, []);

  const generateRandomThreat = useCallback((): ThreatData => {
    const type = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    const severity = (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;

    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type,
      severity,
      source,
      payload: {},
      metadata: {},
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const threat = generateRandomThreat();
      analyzeThreat(threat);
    }, 5000);

    return () => clearInterval(interval);
  }, [analyzeThreat, generateRandomThreat]);

  const handleManualAnalysis = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const threat = generateRandomThreat();
    analyzeThreat(threat);
  }, [analyzeThreat, generateRandomThreat]);

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">Sentinel AI Dashboard</h1>
          <button
            onClick={handleManualAnalysis}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze New Threat'}
          </button>
        </div>

        <ThreatStats results={results} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ThreatGraph results={results} />
          <ThreatMap threats={threats} />
        </div>

        <ThreatList results={results} />
      </div>
      <Chatbot />
    </div>
  );
}

export default App;