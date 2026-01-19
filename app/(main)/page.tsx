'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export default function Home() {
  const features = [
    {
      icon: '📋',
      title: 'Requirements Analysis',
      description: 'Extract functional and non-functional requirements from your project description',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: '🔧',
      title: 'Tech Stack Recommendations',
      description: 'Get AI-powered technology suggestions tailored to your team and timeline',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: '⚠️',
      title: 'Risk Assessment',
      description: 'Identify potential risks and mitigation strategies before you start building',
      gradient: 'from-orange-500/20 to-red-500/20',
    },
  ];

  return (
    <main className="min-h-screen pb-20 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 animated-gradient-bg -z-20" />
      
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="space-y-10 animate-slide-up">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  AI-Powered Project Planning
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-700 leading-[1.1]">
                  <span className="text-neutral-900 dark:text-neutral-50">AutoPilot</span>
                  <span className="gradient-text"> AI</span>
                </h1>
                
                <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed">
                  Transform vague software ideas into structured, execution-ready project plans. Powered by agentic AI to analyze requirements, recommend tech stacks, and assess risks.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/create" className="inline-block">
                  <Button size="lg">
                    <span>Create Project Plan</span>
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/projects" className="inline-block">
                  <Button variant="outline" size="lg">View Projects</Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-neutral-200 dark:border-neutral-800/50">
                <div className="animate-count stagger-1">
                  <div className="text-3xl sm:text-4xl font-display font-700 gradient-text">10K+</div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-500 mt-1">Projects Analyzed</p>
                </div>
                <div className="animate-count stagger-2">
                  <div className="text-3xl sm:text-4xl font-display font-700 gradient-text">4.9★</div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-500 mt-1">Average Rating</p>
                </div>
                <div className="animate-count stagger-3">
                  <div className="text-3xl sm:text-4xl font-display font-700 gradient-text">50+</div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-500 mt-1">AI Agents</p>
                </div>
              </div>
            </div>

            {/* Right: 3D-style dashboard preview */}
            <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 blur-3xl rounded-full" />
                
                {/* Preview card */}
                <Card variant="glass" className="relative transform perspective-1000 rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-500">
                  <CardBody className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800/50">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-neutral-600 dark:text-neutral-500 text-sm ml-2">Project Analysis</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400">✓</div>
                        <div className="flex-1">
                          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full w-full progress-gradient" />
                          </div>
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-500">Requirements</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500 dark:text-purple-400">✓</div>
                        <div className="flex-1">
                          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full w-4/5 progress-gradient" />
                          </div>
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-500">Tech Stack</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-500 dark:text-cyan-400 animate-pulse">⚡</div>
                        <div className="flex-1">
                          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full w-3/5 progress-gradient" />
                          </div>
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-500">Risk Analysis</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">Overall Progress</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">78%</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-4">
              Powerful <span className="gradient-text">AI Analysis</span>
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Our intelligent agents collaborate to deliver comprehensive project planning in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                isHoverable
                variant="glass"
                className={`animate-slide-up group overflow-hidden relative stagger-${index + 1}`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                <CardBody className="space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-display font-700 text-neutral-900 dark:text-neutral-50">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card variant="glow" className="relative overflow-hidden">
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 pointer-events-none" />
            
            <CardBody className="space-y-8 relative z-10 text-center py-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
                  Ready to plan your next project?
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
                  Our AI agents will work together to create a comprehensive project plan in minutes. Get started free today.
                </p>
              </div>

              <div className="flex justify-center">
                <Link href="/create">
                  <Button size="xl">
                    <span>Get Started Now</span>
                    <svg className="w-6 h-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </main>
  );
}
