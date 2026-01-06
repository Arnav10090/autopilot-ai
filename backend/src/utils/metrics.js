//METRICS STORE (IN-MEMORY)

export const metrics = {
  agents: {
    requirements: initAgentMetrics(),
    techStack: initAgentMetrics(),
    taskPlanner: initAgentMetrics(),
    riskAssessment: initAgentMetrics()
  }
};

function initAgentMetrics() {
  return {
    totalCalls: 0,
    successes: 0,
    failures: 0,
    fallbacksUsed: 0,
    totalRetries: 0,
    totalLatencyMs: 0
  };
}

export function recordSuccess(agentName, latencyMs, retries) {
  const m = metrics.agents[agentName];
  m.totalCalls++;
  m.successes++;
  m.totalLatencyMs += latencyMs;
  m.totalRetries += retries;
}

export function recordFailure(agentName, latencyMs, retries) {
  const m = metrics.agents[agentName];
  m.totalCalls++;
  m.failures++;
  m.totalLatencyMs += latencyMs;
  m.totalRetries += retries;
}

export function recordFallback(agentName) {
  metrics.agents[agentName].fallbacksUsed++;
}
