'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      try {
        // Get user ID from local storage (simplified auth)
        let userId = null;
        try {
          const stored = localStorage.getItem('user');
          if (stored) {
            userId = JSON.parse(stored).id;
          }
        } catch (e) {
          console.error("Failed to parse user", e);
        }

        const data = await import('@/services/api').then(m => m.getMetrics(dateRange, userId));
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [dateRange]);

  // Process metrics data
  const processedMetrics = metrics?.agents || {
    requirements: { totalCalls: 0, successes: 0, failures: 0, totalLatencyMs: 0 },
    techStack: { totalCalls: 0, successes: 0, failures: 0, totalLatencyMs: 0 },
    riskAssessment: { totalCalls: 0, successes: 0, failures: 0, totalLatencyMs: 0 },
    taskPlanner: { totalCalls: 0, successes: 0, failures: 0, totalLatencyMs: 0 },
  };

  const agentMetrics = [
    {
      name: 'Requirements Agent',
      key: 'requirements',
      calls: processedMetrics.requirements.totalCalls,
      avgLatency: processedMetrics.requirements.totalCalls > 0 
        ? Math.round(processedMetrics.requirements.totalLatencyMs / processedMetrics.requirements.totalCalls) 
        : 0,
      failures: processedMetrics.requirements.failures,
      successRate: processedMetrics.requirements.totalCalls > 0
        ? (processedMetrics.requirements.successes / processedMetrics.requirements.totalCalls) * 100
        : 100,
    },
    {
      name: 'Tech Stack Agent',
      key: 'techStack',
      calls: processedMetrics.techStack.totalCalls,
      avgLatency: processedMetrics.techStack.totalCalls > 0
        ? Math.round(processedMetrics.techStack.totalLatencyMs / processedMetrics.techStack.totalCalls)
        : 0,
      failures: processedMetrics.techStack.failures,
      successRate: processedMetrics.techStack.totalCalls > 0
        ? (processedMetrics.techStack.successes / processedMetrics.techStack.totalCalls) * 100
        : 100,
    },
    {
      name: 'Risk Analysis Agent',
      key: 'riskAssessment',
      calls: processedMetrics.riskAssessment.totalCalls,
      avgLatency: processedMetrics.riskAssessment.totalCalls > 0
        ? Math.round(processedMetrics.riskAssessment.totalLatencyMs / processedMetrics.riskAssessment.totalCalls)
        : 0,
      failures: processedMetrics.riskAssessment.failures,
      successRate: processedMetrics.riskAssessment.totalCalls > 0
        ? (processedMetrics.riskAssessment.successes / processedMetrics.riskAssessment.totalCalls) * 100
        : 100,
    },
    {
      name: 'Execution Plan Agent',
      key: 'taskPlanner',
      calls: processedMetrics.taskPlanner.totalCalls,
      avgLatency: processedMetrics.taskPlanner.totalCalls > 0
        ? Math.round(processedMetrics.taskPlanner.totalLatencyMs / processedMetrics.taskPlanner.totalCalls)
        : 0,
      failures: processedMetrics.taskPlanner.failures,
      successRate: processedMetrics.taskPlanner.totalCalls > 0
        ? (processedMetrics.taskPlanner.successes / processedMetrics.taskPlanner.totalCalls) * 100
        : 100,
    },
  ];

  // Calculate totals for KPIs
  const totalCalls = agentMetrics.reduce((sum, agent) => sum + agent.calls, 0);
  const totalLatency = agentMetrics.reduce((sum, agent) => sum + (agent.avgLatency * agent.calls), 0);
  const globalAvgLatency = totalCalls > 0 ? Math.round(totalLatency / totalCalls) : 0;
  
  const totalSuccesses = Object.values(processedMetrics).reduce((sum: number, m: any) => sum + m.successes, 0);
  const globalSuccessRate = totalCalls > 0 ? ((totalSuccesses / totalCalls) * 100).toFixed(1) : '100.0';

  // Use DB metrics for accurate project count if available, otherwise estimate or 0
  const realProjectCount = metrics?.projects?.totalProjects ?? 0;

  const kpis = [
    { label: 'Total Projects Analyzed', value: realProjectCount.toLocaleString(), change: 0, icon: '📊' },
    { label: 'Avg Analysis Time', value: `${(globalAvgLatency * 4 / 1000).toFixed(1)}s`, change: 0, icon: '⏱️' },
    { label: 'Success Rate', value: `${globalSuccessRate}%`, change: 0, icon: '✓' },
    { label: 'API Calls', value: totalCalls.toLocaleString(), change: 0, icon: '🔄' },
  ];

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
            <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Monitor AI agent performance and system metrics
          </p>
        </div>

        {/* Date range selector */}
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateRange === range
                  ? 'bg-neutral-900 dark:bg-accent text-white shadow-md'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, i) => (
          <Card key={i} isHoverable className="animate-slide-up group overflow-hidden relative" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <CardBody className="space-y-4 relative z-10">
              <div className="flex items-start justify-between">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{kpi.label}</p>
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{kpi.icon}</span>
              </div>

              <div className="space-y-2">
                <p className="text-3xl font-display font-700 text-neutral-900 dark:text-neutral-50 group-hover:text-accent transition-colors duration-300">
                  {kpi.value}
                </p>
                <p className={`text-sm font-medium transition-all duration-300 ${kpi.change > 0 ? 'text-success' : 'text-danger'}`}>
                  {kpi.change > 0 ? '↑' : '↓'} {Math.abs(kpi.change)}% from last period
                </p>
              </div>

              <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-700 ease-out"
                  style={{ width: `${75 + ((i * 13) % 25)}%` }}
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Agent Performance */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
            Agent Performance
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Real-time metrics for AI analysis agents
          </p>
        </div>

        <div className="overflow-x-auto">
          <Card>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left p-4 font-display font-700 text-neutral-900 dark:text-neutral-50">
                    Agent Name
                  </th>
                  <th className="text-left p-4 font-display font-700 text-neutral-900 dark:text-neutral-50">
                    Total Calls
                  </th>
                  <th className="text-left p-4 font-display font-700 text-neutral-900 dark:text-neutral-50">
                    Avg Latency
                  </th>
                  <th className="text-left p-4 font-display font-700 text-neutral-900 dark:text-neutral-50">
                    Failures
                  </th>
                  <th className="text-left p-4 font-display font-700 text-neutral-900 dark:text-neutral-50">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-500">Loading metrics...</td>
                  </tr>
                ) : (
                  agentMetrics.map((agent, i) => (
                    <tr
                      key={i}
                      className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-neutral-900 dark:text-neutral-50">
                        {agent.name}
                      </td>
                      <td className="p-4 text-neutral-600 dark:text-neutral-400">
                        {agent.calls.toLocaleString()}
                      </td>
                      <td className="p-4 text-neutral-600 dark:text-neutral-400">
                        {agent.avgLatency}ms
                      </td>
                      <td className="p-4">
                        <Badge variant={agent.failures === 0 ? 'success' : 'warning'}>
                          {agent.failures}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium text-neutral-900 dark:text-neutral-50">
                        {agent.successRate.toFixed(1)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* Cost Estimates */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
            Cost Estimates
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'API Costs', value: `$${(totalCalls * 0.002).toFixed(2)}`, period: 'Estimated @ $0.002/call' },
            { label: 'Processing Time', value: `${(totalLatency / 1000 / 60).toFixed(1)} m`, period: 'Total compute time' },
            { label: 'Projects Analyzed', value: realProjectCount.toLocaleString(), period: 'Session total' },
          ].map((item, i) => (
            <Card key={i} isHoverable>
              <CardBody className="text-center space-y-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.label}</p>
                <p className="text-3xl font-display font-700 text-accent">{item.value}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{item.period}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>


      {/* Export options */}
      <Card>
        <CardHeader title="Export Data" subtitle="Download analytics reports" />
        <CardBody>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => {
              const headers = ['Agent Name', 'Total Calls', 'Avg Latency (ms)', 'Failures', 'Success Rate (%)'];
              const rows = agentMetrics.map(agent => [
                agent.name,
                agent.calls,
                agent.avgLatency,
                agent.failures,
                agent.successRate
              ]);
              const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', `analytics_export_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}>
              📊 Export CSV
            </Button>
            
            <Button variant="outline" onClick={() => window.print()}>
              📄 Download PDF
            </Button>
            
            <Button variant="outline" onClick={() => {
              const report = {
                generatedAt: new Date().toISOString(),
                period: dateRange,
                kpis,
                agentMetrics,
                systemStatus: 'Healthy'
              };
              
              const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.json`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}>
              📈 Generate Report
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
