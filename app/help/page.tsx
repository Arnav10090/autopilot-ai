'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'getting-started' | 'features' | 'account' | 'billing';
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'getting-started-1',
    question: 'How do I create my first project?',
    answer: 'Click the "Create Project Plan" button on the homepage or navigate to the Create page. Enter your project description, and our AI agents will analyze it to generate requirements, recommend a tech stack, assess risks, and create an execution plan.',
    category: 'getting-started',
  },
  {
    id: 'getting-started-2',
    question: 'What information should I provide when creating a project?',
    answer: 'Provide a clear description of your project goals, target audience, expected timeline, and any specific technical constraints. The more detail you provide, the more accurate our AI analysis will be.',
    category: 'getting-started',
  },
  {
    id: 'getting-started-3',
    question: 'How long does the analysis take?',
    answer: 'Most project analyses complete within 2-5 minutes. Complex projects with many requirements may take up to 10 minutes. You can track progress in real-time as our agents work.',
    category: 'getting-started',
  },
  {
    id: 'features-1',
    question: 'What can the Requirements Analysis agent do?',
    answer: 'The Requirements Analysis agent extracts functional and non-functional requirements from your project description. It identifies critical features, user stories, performance requirements, and constraints.',
    category: 'features',
  },
  {
    id: 'features-2',
    question: 'How accurate are the Tech Stack recommendations?',
    answer: 'Our recommendations are based on industry best practices, your project requirements, team expertise, and timeline. We analyze thousands of successful projects to provide tailored suggestions.',
    category: 'features',
  },
  {
    id: 'features-3',
    question: 'What does the Risk Assessment include?',
    answer: 'Risk assessment identifies technical risks, schedule risks, resource constraints, integration challenges, and potential failures. Each risk includes severity level and mitigation strategies.',
    category: 'features',
  },
  {
    id: 'features-4',
    question: 'Can I export the project plan?',
    answer: 'Yes! You can export project plans as PDF, CSV, or JSON formats. From your project detail page, use the export options in the menu to download your analysis.',
    category: 'features',
  },
  {
    id: 'account-1',
    question: 'How do I reset my password?',
    answer: 'Visit the login page and click "Forgot Password". Enter your email address, and we\'ll send you a reset link. Click the link and set a new password.',
    category: 'account',
  },
  {
    id: 'account-2',
    question: 'Can I delete my account?',
    answer: 'Yes. Go to Settings > Danger Zone and click "Delete Account". This action is permanent and will delete all associated data. You cannot undo this action.',
    category: 'account',
  },
  {
    id: 'account-3',
    question: 'How do I manage API keys?',
    answer: 'Navigate to Settings > API Keys to view, rotate, or revoke your API keys. We recommend rotating keys regularly for security.',
    category: 'account',
  },
  {
    id: 'billing-1',
    question: 'What is the pricing model?',
    answer: 'We offer a free tier with limited analyses, plus paid plans with additional features. Visit our pricing page for detailed information about each plan.',
    category: 'billing',
  },
  {
    id: 'billing-2',
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: 'Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle.',
    category: 'billing',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'features', label: 'Features' },
  { id: 'account', label: 'Account' },
  { id: 'billing', label: 'Billing' },
];

function FAQItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left p-6 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${item.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-display font-600 text-neutral-900 dark:text-neutral-50 text-left">
          {item.question}
        </h3>
        <span className={`text-accent text-xl font-light flex-shrink-0 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}>
          ▼
        </span>
      </div>
      {isOpen && (
        <div id={`faq-answer-${item.id}`} className="mt-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {item.answer}
        </div>
      )}
    </button>
  );
}

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());

  const filteredFAQs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFAQs(newExpanded);
  };

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12 space-y-4">
        <div className="animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
            Help & Support
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Find answers to common questions and learn how to get the most out of AutoPilot AI
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <a href="#faq" className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
            <span className="text-xl">❓</span>
            <span className="text-sm font-medium">FAQ</span>
          </a>
          <a href="#documentation" className="flex items-center gap-2 p-3 rounded-lg bg-accent-2/10 text-accent-2 hover:bg-accent-2/20 transition-colors">
            <span className="text-xl">📚</span>
            <span className="text-sm font-medium">Docs</span>
          </a>
          <a href="mailto:support@autopilot.ai" className="flex items-center gap-2 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
            <span className="text-xl">✉️</span>
            <span className="text-sm font-medium">Email</span>
          </a>
          <a href="#" className="flex items-center gap-2 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
            <span className="text-xl">💬</span>
            <span className="text-sm font-medium">Chat</span>
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="mb-16">
        <div className="mb-8 space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div>
            <h2 className="text-3xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Browse our FAQ database or search for specific topics
            </p>
          </div>

          {/* Search */}
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
            aria-label="Search FAQs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setExpandedFAQs(new Set());
              }}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm ${
                selectedCategory === cat.id
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
              aria-pressed={selectedCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Cards */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {filteredFAQs.length > 0 ? (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredFAQs.map((item) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={expandedFAQs.has(item.id)}
                  onToggle={() => toggleFAQ(item.id)}
                />
              ))}
            </div>
          ) : (
            <CardBody className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                No matching questions found
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-accent hover:text-accent-2 font-medium transition-colors"
              >
                Clear filters
              </button>
            </CardBody>
          )}
        </Card>
      </section>

      {/* Documentation Section */}
      <section id="documentation" className="mb-16">
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <h2 className="text-3xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
            Documentation
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Comprehensive guides and tutorials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: '🚀',
              title: 'Getting Started',
              description: 'Learn how to create your first project and analyze requirements.',
              href: '#',
            },
            {
              icon: '🎯',
              title: 'Best Practices',
              description: 'Tips and strategies for getting the most accurate analysis results.',
              href: '#',
            },
            {
              icon: '🔌',
              title: 'API Reference',
              description: 'Complete API documentation for integrating AutoPilot AI into your workflow.',
              href: '#',
            },
            {
              icon: '🛠️',
              title: 'Integrations',
              description: 'Connect AutoPilot AI with your favorite tools and services.',
              href: '#',
            },
            {
              icon: '📊',
              title: 'Analytics',
              description: 'Understanding metrics, KPIs, and agent performance data.',
              href: '#',
            },
            {
              icon: '🔒',
              title: 'Security',
              description: 'Data protection, privacy policies, and security best practices.',
              href: '#',
            },
          ].map((doc, i) => (
            <a
              key={i}
              href={doc.href}
              className="group animate-slide-up"
              style={{ animationDelay: `${0.4 + i * 0.05}s` }}
            >
              <Card isHoverable>
                <CardBody className="space-y-3">
                  <span className="text-4xl block">{doc.icon}</span>
                  <h3 className="text-lg font-display font-700 text-neutral-900 dark:text-neutral-50 group-hover:text-accent transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {doc.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-accent group-hover:gap-3 transition-all text-sm font-medium">
                    Learn more
                    <span>→</span>
                  </span>
                </CardBody>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-16">
        <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <Card className="glass border-accent/30 dark:border-accent/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 pointer-events-none" />
            <CardBody className="space-y-6 relative z-10">
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
                  Need more help?
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <a href="mailto:support@autopilot.ai">
                  <Button variant="outline">📧 Email Support</Button>
                </a>
                <a href="#">
                  <Button>💬 Start Live Chat</Button>
                </a>
              </div>

              <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                Average response time: 2 hours during business hours
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Resource Links */}
      <section className="pb-12">
        <div className="text-center space-y-6 animate-slide-up" style={{ animationDelay: '0.75s' }}>
          <h3 className="text-lg font-display font-700 text-neutral-900 dark:text-neutral-50">
            Useful Resources
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { label: 'Status Page', href: '#' },
              { label: 'Community', href: '#' },
              { label: 'Blog', href: '#' },
              { label: 'Changelog', href: '#' },
              { label: 'Terms of Service', href: '#' },
              { label: 'Privacy Policy', href: '#' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
