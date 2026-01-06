//Enhanced Retry + Timeout + Fallback Utility
//METRICS-AWARE EXECUTION GUARD

import Ajv from "ajv";
import { withTimeout } from "./withTimeout.js";
import {
  recordSuccess,
  recordFailure,
  recordFallback
} from "./metrics.js";
import { logInfo, logError } from "./logger.js";

const ajv = new Ajv();

export async function executeWithGuards({
  agentName,
  runAgent,
  schema,
  fallback,
  maxRetries = 2,
  timeoutMs = 15000
}) {
  const validate = ajv.compile(schema);
  let retries = 0;
  const startTime = Date.now();

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await withTimeout(runAgent(), timeoutMs);

      if (validate(result)) {
        const latency = Date.now() - startTime;
        recordSuccess(agentName, latency, retries);

        logInfo("Agent succeeded", {
          agent: agentName,
          latencyMs: latency,
          retries
        });

        return result;
      }

      retries++;
      throw new Error("Schema validation failed");
    } catch (err) {
      retries++;

      if (attempt > maxRetries) {
        const latency = Date.now() - startTime;

        recordFailure(agentName, latency, retries);
        recordFallback(agentName);

        logError("Agent failed, using fallback", {
          agent: agentName,
          error: err.message,
          latencyMs: latency,
          retries
        });

        return fallback;
      }
    }
  }
}

//This is the heart of observability.
//This utility guarantees:
// No infinite waits
// No crashes
// Always returns something