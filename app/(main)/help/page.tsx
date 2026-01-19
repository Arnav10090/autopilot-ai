'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useChat } from '@/contexts/ChatContext';

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

interface DocItem {
  icon: string;
  title: string;
  description: string;
  content: string;
}

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  
  const { toggleOpen, isOpen } = useChat();
  
  const openChat = () => {
    if (!isOpen) {
      toggleOpen();
    }
  };

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

  const docs: DocItem[] = [
    {
      icon: '🚀',
      title: 'Getting Started',
      description: 'Learn how to create your first project and analyze requirements.',
      content: 'This guide will walk you through the process of setting up your account, creating your first project, and interpreting the initial analysis results. Start by clicking the "New Project" button on your dashboard.',
    },
    {
      icon: '🎯',
      title: 'Best Practices',
      description: 'Tips and strategies for getting the most accurate analysis results.',
      content: 'To get the best results from our AI agents, be specific in your project descriptions. Mention key stakeholders, expected user load, and specific technology preferences if you have them.',
    },
    {
      icon: '🔌',
      title: 'API Reference',
      description: 'Complete API documentation for integrating AutoPilot AI into your workflow.',
      content: 'Our REST API allows you to programmatically create projects and retrieve analysis results. Authentication is handled via API keys which can be generated in your settings.',
    },
    {
      icon: '🛠️',
      title: 'Integrations',
      description: 'Connect AutoPilot AI with your favorite tools and services.',
      content: 'AutoPilot AI integrates with Jira, GitHub, and Slack depending on your plan. This section covers how to configure webhooks and OAuth connections.',
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Understanding metrics, KPIs, and agent performance data.',
      content: 'The Analytics dashboard provides insights into how many projects you have analyzed, the average complexity score, and agent performance metrics over time.',
    },
    {
      icon: '🔒',
      title: 'Security',
      description: 'Data protection, privacy policies, and security best practices.',
      content: 'We take security seriously. All project data is encrypted at rest and in transit. Read our full security policy here along with our compliance certifications.',
    },
  ];

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 space-y-4">
        <div className="animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
            <span className="gradient-text">Help & Support</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Find answers to common questions and learn how to get the most out of AutoPilot AI
          </p>
        </div>

        {/* Quick Links Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'FAQ', icon: '❓', href: '#faq', isChat: false },
            { label: 'Docs', icon: '📚', href: '#documentation', isChat: false },
            { label: 'Email', icon: '✉️', href: 'mailto:support@autopilot.ai', isChat: false },
            { label: 'Chat', icon: '💬', href: '#', isChat: true },
          ].map((link, i) => (
            link.isChat ? (
              <button
                key={i}
                onClick={openChat}
                className="group flex items-center justify-center gap-3 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm dark:shadow-md font-medium border border-neutral-200 dark:border-transparent"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ) : (
              <a
                key={i}
                href={link.href}
                className="group flex items-center justify-center gap-3 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm dark:shadow-md font-medium border border-neutral-200 dark:border-transparent"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{link.icon}</span>
                <span>{link.label}</span>
              </a>
            )
          ))}
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
                  ? 'bg-neutral-900 dark:bg-accent text-white shadow-md'
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
          {docs.map((doc, i) => (
            <button
              key={i}
              onClick={() => setSelectedDoc(doc)}
              className="group animate-slide-up text-left w-full"
              style={{ animationDelay: `${0.4 + i * 0.05}s` }}
            >
              <Card isHoverable className="h-full">
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
            </button>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-16">
        <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700/50 shadow-xl">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-neutral-300/30 dark:bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neutral-200/50 dark:bg-accent-2/10 rounded-full blur-3xl" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neutral-400 dark:via-accent to-transparent" />
            
            <div className="relative z-10 px-8 py-12 sm:py-16 text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 mb-6">
                <span className="text-3xl">💬</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-3">
                Need more help?
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8">
                Can't find what you're looking for? Our support team is here to help.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@autopilot.ai">
                  <Button variant="secondary" size="lg">📧 Email Support</Button>
                </a>
                <Button onClick={openChat} size="lg">💬 Start Live Chat</Button>
              </div>
            </div>
          </div>
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

       {/* Documentation Modal */}
       <Modal
        isOpen={selectedDoc !== null}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title}
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-4xl mb-4">
            {selectedDoc?.icon}
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              {selectedDoc?.description}
            </p>
            <hr className="my-6 border-neutral-200 dark:border-neutral-800" />
            <h3 className="text-xl font-bold mb-4 font-display">Overview</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {selectedDoc?.content}
            </p>
            <div className="mt-8 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800">
              <p className="text-sm text-neutral-500 italic">
                This serves as a preview of the documentation content. In a production environment, this would load the full article or redirect to a dedicated documentation platform.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </main>
  );
}
