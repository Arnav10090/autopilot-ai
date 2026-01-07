import { MetricsResponse } from "@/types/metrics";

interface Props {
  metrics: MetricsResponse;
}

export default function MetricsDashboard({ metrics }: Props) {
  return (
    <section className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">System Metrics</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Real-time observability data from AI agent execution
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(metrics.agents).map(([agentName, data]) => {
          const avgLatency =
            data.totalCalls > 0
              ? Math.round(data.totalLatencyMs / data.totalCalls)
              : 0;
          const successRate =
            data.totalCalls > 0
              ? Math.round((data.successes / data.totalCalls) * 100)
              : 0;

          return (
            <div
              key={agentName}
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                {agentName} Agent
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Calls</span>
                  <span className="font-semibold text-gray-900">
                    {data.totalCalls}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">
                    {successRate}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Failures</span>
                  <span className="font-semibold text-red-600">
                    {data.failures}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fallbacks Used</span>
                  <span className="font-semibold text-yellow-600">
                    {data.fallbacksUsed}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Retries</span>
                  <span className="font-semibold text-gray-900">
                    {data.totalRetries}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Avg Latency</span>
                  <span className="font-semibold text-blue-600">
                    {avgLatency}ms
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}