CREATE TABLE IF NOT EXISTS threats (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  type VARCHAR(50) NOT NULL,
  severity INTEGER NOT NULL,
  source VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id SERIAL PRIMARY KEY,
  is_anomaly BOOLEAN NOT NULL,
  confidence FLOAT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL
);

CREATE INDEX idx_threats_timestamp ON threats(timestamp DESC);
CREATE INDEX idx_analysis_results_timestamp ON analysis_results(timestamp DESC);