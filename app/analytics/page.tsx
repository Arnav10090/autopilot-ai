'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');

  const kpis = [
    { label: 'Total Projects Analyzed', value: '1,247', change: 12, icon: '📊' },
    { label: 'Avg Analysis Time', value: '4.2m', change: -8, icon: '⏱️' },
    { label: 'Success Rate', value: '98.5%', change: 2, icon: '✓' },
    { label: 'API Calls', value: '45.2K', change: 23, icon: '🔄' },
  ];

  const agentMetrics = [
    {
      name: 'Requirements Agent',
      calls: 1247,
      avgLatency: 2400,
      failures: 12,
      successRate: 99.0,
    },
    {
      name: 'Tech Stack Agent',
      calls: 1247,
      avgLatency: 1800,
      failures: 8,
      successRate: 99.4,
    },
    {
      name: 'Risk Analysis Agent',
      calls: 1247,
      avgLatency: 3100,
      failures: 18,
      successRate: 98.6,
    },
    {
      name: 'Execution Plan Agent',
      calls: 1247,
      avgLatency: 2800,
      failures: 15,
      successRate: 98.8,
    },
  ];

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
            Analytics
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
                  ? 'bg-accent text-white shadow-md'
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
                  style={{ width: `${75 + Math.random() * 25}%` }}
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
                {agentMetrics.map((agent, i) => (
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
                      <Badge variant={agent.failures < 10 ? 'success' : agent.failures < 20 ? 'warning' : 'danger'}>
                        {agent.failures}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium text-neutral-900 dark:text-neutral-50">
                      {agent.successRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
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
            { label: 'API Costs', value: '$2,450', period: 'This month' },
            { label: 'Processing Time', value: '847 hours', period: 'Total compute' },
            { label: 'Projects Analyzed', value: '1,247', period: 'This month' },
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
            <Button variant="outline">📊 Export CSV</Button>
            <Button variant="outline">📄 Download PDF</Button>
            <Button variant="outline">📈 Generate Report</Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
