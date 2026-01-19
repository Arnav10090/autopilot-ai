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
    events: [], // Store { timestamp, type: 'success'|'failure', latency, retries }
    fallbacksUsed: 0 // Keep cumulative for now
  };
}

export function recordSuccess(agentName, latencyMs, retries) {
  const m = metrics.agents[agentName];
  m.events.push({
    timestamp: new Date(),
    type: 'success',
    latency: latencyMs,
    retries: retries
  });
  // Keep array from growing infinitely - keep last 1000 events per agent
  if (m.events.length > 1000) m.events.shift();
}

export function recordFailure(agentName, latencyMs, retries) {
  const m = metrics.agents[agentName];
  m.events.push({
    timestamp: new Date(),
    type: 'failure',
    latency: latencyMs,
    retries: retries
  });
  if (m.events.length > 1000) m.events.shift();
}

export function recordFallback(agentName) {
  metrics.agents[agentName].fallbacksUsed++;
}

export function getAgentPerformance(startDate) {
  const result = {};
  
  for (const [agentName, data] of Object.entries(metrics.agents)) {
    // Filter events by date
    const relevantEvents = data.events.filter(e => e.timestamp >= startDate);
    
    const totalCalls = relevantEvents.length;
    const successes = relevantEvents.filter(e => e.type === 'success').length;
    const failures = relevantEvents.filter(e => e.type === 'failure').length;
    
    const totalLatency = relevantEvents.reduce((sum, e) => sum + (e.latency || 0), 0);
    
    result[agentName] = {
      totalCalls,
      successes,
      failures,
      totalLatencyMs: totalLatency,
      fallbacksUsed: data.fallbacksUsed // This remains cumulative
    };
  }
  
  return result;
}
