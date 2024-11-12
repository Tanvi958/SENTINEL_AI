export interface ThreatData {
  id: string;
  timestamp: number;
  type: 'malware' | 'phishing' | 'network' | 'unknown';
  severity: 1 | 2 | 3 | 4 | 5;
  source: string;
  payload: unknown;
  metadata: Record<string, unknown>;
}

export interface AnomalyDetectionResult {
  isAnomaly: boolean;
  confidence: number;
  details: string;
  timestamp: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}