'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { FloatingAccent } from '@/components/FloatingAccent';

export default function Home() {
  const features = [
    {
      icon: '📋',
      title: 'Requirements Analysis',
      description: 'Extract functional and non-functional requirements from your project description',
    },
    {
      icon: '🔧',
      title: 'Tech Stack Recommendations',
      description: 'Get AI-powered technology suggestions tailored to your team and timeline',
    },
    {
      icon: '⚠️',
      title: 'Risk Assessment',
      description: 'Identify potential risks and mitigation strategies before you start building',
    },
  ];

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-display font-700 text-neutral-900 dark:text-neutral-50 leading-tight">
                  AutoPilot AI
                </h1>
                <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed">
                  Transform vague software ideas into structured, execution-ready project plans. Powered by agentic AI to analyze requirements, recommend tech stacks, and assess risks.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/create" className="inline-block">
                  <Button size="lg">Create Project Plan</Button>
                </Link>
                <Link href="/projects" className="inline-block">
                  <Button variant="outline" size="lg">View Projects</Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <div className="text-3xl font-display font-700 text-accent">10K+</div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Projects Analyzed</p>
                </div>
                <div>
                  <div className="text-3xl font-display font-700 text-accent">4.9★</div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right: Floating accent */}
            <div className="hidden lg:block h-96 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <FloatingAccent />
            </div>
          </div>

          {/* Mobile floating accent */}
          <div className="lg:hidden mt-12 animate-fade-in">
            <FloatingAccent />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-4">
              Powerful AI Analysis
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Our intelligent agents collaborate to deliver comprehensive project planning in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                isHoverable
                className="animate-slide-up group overflow-hidden relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-2/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <CardBody className="space-y-4 relative z-10">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-display font-700 text-neutral-900 dark:text-neutral-50">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="glass border-accent/30 dark:border-accent/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 pointer-events-none" />
            <CardBody className="space-y-6 relative z-10">
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
                  Ready to plan your next project?
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Our AI agents will work together to create a comprehensive project plan in minutes. Get started free today.
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <Link href="/create">
                  <Button size="xl">Get Started Now</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </main>
  );
}
