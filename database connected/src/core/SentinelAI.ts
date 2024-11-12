import { AnomalyDetector } from './AnomalyDetector';
import { KnowledgeGraph } from './KnowledgeGraph';
import { db } from '../services/db';
import type { ThreatData, AnomalyDetectionResult } from '../types';

export class SentinelAI {
  private anomalyDetector: AnomalyDetector;
  private knowledgeGraph: KnowledgeGraph;
  private threatCache: Map<string, ThreatData>;

  constructor() {
    this.anomalyDetector = new AnomalyDetector();
    this.knowledgeGraph = new KnowledgeGraph();
    this.threatCache = new Map();
  }

  public async analyzeThreat(data: ThreatData): Promise<AnomalyDetectionResult> {
    // Cache the threat data
    this.threatCache.set(data.id, data);

    // Save threat to database
    await db.saveThreat(data);

    // Perform anomaly detection
    const result = await this.anomalyDetector.detect(data);

    // Save analysis result to database
    await db.saveAnalysisResult(result);

    // Update knowledge graph
    this.updateKnowledgeGraph(data);

    return result;
  }

  private updateKnowledgeGraph(data: ThreatData): void {
    this.knowledgeGraph.addNode({
      id: data.id,
      type: data.type,
      properties: {
        severity: data.severity,
        timestamp: data.timestamp,
        source: data.source,
      },
    });

    // Connect related threats
    for (const [id, cachedThreat] of this.threatCache) {
      if (id !== data.id && this.areThreatsRelated(data, cachedThreat)) {
        this.knowledgeGraph.addEdge({
          source: data.id,
          target: id,
          type: 'related',
          weight: this.calculateRelationWeight(data, cachedThreat),
        });
      }
    }
  }

  private areThreatsRelated(threat1: ThreatData, threat2: ThreatData): boolean {
    return (
      threat1.type === threat2.type ||
      threat1.source === threat2.source ||
      Math.abs(threat1.timestamp - threat2.timestamp) < 3600000 // 1 hour
    );
  }

  private calculateRelationWeight(threat1: ThreatData, threat2: ThreatData): number {
    let weight = 0;

    if (threat1.type === threat2.type) weight += 0.4;
    if (threat1.source === threat2.source) weight += 0.3;
    if (Math.abs(threat1.timestamp - threat2.timestamp) < 3600000) weight += 0.3;

    return Math.min(1, weight);
  }

  public async train(data: ThreatData[]): Promise<void> {
    // Prepare training data
    const labels = data.map(threat => 
      threat.severity >= 4 ? 1 : 0
    );

    await this.anomalyDetector.train(data, labels);
  }
}