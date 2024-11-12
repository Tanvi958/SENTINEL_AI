// Using a mock database service for frontend
import type { ThreatData, AnomalyDetectionResult } from '../types';

class DatabaseService {
  private threats: ThreatData[] = [];
  private analysisResults: AnomalyDetectionResult[] = [];

  async saveThreat(threat: ThreatData): Promise<void> {
    this.threats.push(threat);
    // Keep only last 100 threats
    if (this.threats.length > 100) {
      this.threats = this.threats.slice(-100);
    }
  }

  async saveAnalysisResult(result: AnomalyDetectionResult): Promise<void> {
    this.analysisResults.push(result);
    // Keep only last 100 results
    if (this.analysisResults.length > 100) {
      this.analysisResults = this.analysisResults.slice(-100);
    }
  }

  async getRecentThreats(limit: number = 100): Promise<ThreatData[]> {
    return this.threats.slice(-limit);
  }

  async getRecentAnalysisResults(
    limit: number = 100
  ): Promise<AnomalyDetectionResult[]> {
    return this.analysisResults.slice(-limit);
  }
}

export const db = new DatabaseService();
