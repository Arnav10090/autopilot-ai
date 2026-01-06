import { MetricsResponse } from "@/types/metrics";

interface Props {
  metrics: MetricsResponse;
}

export default function MetricsDashboard({ metrics }: Props) {
  return (
    <section className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">System Metrics</h2>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metrics.agents).map(([agent, data]) => (
          <div key={agent} className="border rounded p-4">
            <h3 className="font-medium capitalize mb-2">{agent}</h3>

            <p>Total Calls: {data.totalCalls}</p>
            <p>Successes: {data.successes}</p>
            <p>Failures: {data.failures}</p>
            <p>Fallbacks Used: {data.fallbacksUsed}</p>
            <p>Total Retries: {data.totalRetries}</p>
            <p>
              Avg Latency:{" "}
              {data.totalCalls > 0
                ? Math.round(data.totalLatencyMs / data.totalCalls)
                : 0}
              ms
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
