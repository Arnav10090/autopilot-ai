export interface AgentMetrics {
  totalCalls: number;
  successes: number;
  failures: number;
  fallbacksUsed: number;
  totalRetries: number;
  totalLatencyMs: number;
}

export interface MetricsResponse {
  agents: Record<string, AgentMetrics>;
}
