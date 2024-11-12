import * as tf from '@tensorflow/tfjs';
import type { ThreatData, AnomalyDetectionResult } from '../types';

export class AnomalyDetector {
  private model: tf.LayersModel | null = null;
  private readonly threshold: number;

  constructor(threshold = 0.85) {
    this.threshold = threshold;
    this.initModel();
  }

  private async initModel(): Promise<void> {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [10],
    }));
    
    model.add(tf.layers.dropout({ rate: 0.2 }));
    
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
    }));
    
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu',
    }));
    
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid',
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });

    this.model = model;
  }

  public async detect(data: ThreatData): Promise<AnomalyDetectionResult> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const features = this.extractFeatures(data);
    const tensor = tf.tensor2d([features]);
    
    const prediction = this.model.predict(tensor) as tf.Tensor;
    const score = (await prediction.data())[0];

    tensor.dispose();
    prediction.dispose();

    return {
      isAnomaly: score > this.threshold,
      confidence: score,
      details: `Anomaly detection score: ${score.toFixed(4)}`,
      timestamp: Date.now(),
    };
  }

  private extractFeatures(data: ThreatData): number[] {
    // Convert threat data into numerical features
    const features = [
      data.severity,
      data.type === 'malware' ? 1 : 0,
      data.type === 'phishing' ? 1 : 0,
      data.type === 'network' ? 1 : 0,
      Date.now() - data.timestamp,
      // Add more feature extraction logic here
    ];

    // Pad array to match input shape
    while (features.length < 10) {
      features.push(0);
    }

    return features;
  }

  public async train(data: ThreatData[], labels: number[]): Promise<void> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const features = data.map(item => this.extractFeatures(item));
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels, [labels.length, 1]);

    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}`);
        },
      },
    });

    xs.dispose();
    ys.dispose();
  }
}