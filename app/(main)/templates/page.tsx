'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

const TEMPLATES = [
  // ... (keeping existing templates)
  // Web Category
  {
    id: 1,
    name: 'Web Application',
    description: 'Standard web app template with frontend, backend, and database',
    category: 'Web',
    projects: 342,
    icon: '🌐',
  },
  {
    id: 101,
    name: 'E-commerce Store',
    description: 'Full-featured online store with cart, checkout, and inventory management',
    category: 'Web',
    projects: 128,
    icon: '🛍️',
  },
  {
    id: 102,
    name: 'SaaS Dashboard',
    description: 'Admin dashboard with analytics, user management, and subscription billing',
    category: 'Web',
    projects: 256,
    icon: '📊',
  },
  {
    id: 103,
    name: 'Portfolio Site',
    description: 'Personal portfolio template with blog and project showcase',
    category: 'Web',
    projects: 89,
    icon: '🎨',
  },
  {
    id: 104,
    name: 'Social Network',
    description: 'Community platform with profiles, feeds, and messaging',
    category: 'Web',
    projects: 64,
    icon: '👥',
  },
  {
    id: 105,
    name: 'Landing Page',
    description: 'High-conversion landing page optimized for marketing campaigns',
    category: 'Web',
    projects: 412,
    icon: '🚀',
  },

  // Mobile Category
  {
    id: 2,
    name: 'Mobile App',
    description: 'Cross-platform mobile application template',
    category: 'Mobile',
    projects: 218,
    icon: '📱',
  },
  {
    id: 201,
    name: 'Fitness Tracker',
    description: 'Activity tracking app with GPS, health metrics, and progress charts',
    category: 'Mobile',
    projects: 95,
    icon: '🏃',
  },
  {
    id: 202,
    name: 'Food Delivery',
    description: 'On-demand delivery app with real-time tracking and payments',
    category: 'Mobile',
    projects: 142,
    icon: '🍔',
  },
  {
    id: 203,
    name: 'Chat Application',
    description: 'Real-time messaging app with voice and video call support',
    category: 'Mobile',
    projects: 110,
    icon: '💬',
  },
  {
    id: 204,
    name: 'Travel Companion',
    description: 'Trip planner with maps, itineraries, and local guides',
    category: 'Mobile',
    projects: 76,
    icon: '✈️',
  },
  {
    id: 205,
    name: 'Education App',
    description: 'Learning platform with courses, quizzes, and progress tracking',
    category: 'Mobile',
    projects: 134,
    icon: '🎓',
  },

  // Backend Category
  {
    id: 3,
    name: 'API Service',
    description: 'RESTful API and microservices template',
    category: 'Backend',
    projects: 156,
    icon: '⚙️',
  },
  {
    id: 301,
    name: 'Authentication Svc',
    description: 'Secure auth service with OAuth, JWT, and role-based access',
    category: 'Backend',
    projects: 289,
    icon: '🔒',
  },
  {
    id: 302,
    name: 'Payment Gateway',
    description: 'Payment processing integration with subscription handling',
    category: 'Backend',
    projects: 145,
    icon: '💳',
  },
  {
    id: 303,
    name: 'Content CMS',
    description: 'Headless CMS for managing structured content delivery',
    category: 'Backend',
    projects: 112,
    icon: '📝',
  },
  {
    id: 304,
    name: 'Real-time Server',
    description: 'WebSocket server for live updates and notifications',
    category: 'Backend',
    projects: 87,
    icon: '🔄',
  },
  {
    id: 305,
    name: 'Search Engine',
    description: 'Full-text search service with indexing and relevance ranking',
    category: 'Backend',
    projects: 63,
    icon: '🔍',
  },

  // Data Category
  {
    id: 4,
    name: 'Data Pipeline',
    description: 'ETL and data processing pipeline template',
    category: 'Data',
    projects: 89,
    icon: '📊',
  },
  {
    id: 401,
    name: 'Analytics Warehouse',
    description: 'Data warehouse setup with automatic reporting and dashboards',
    category: 'Data',
    projects: 104,
    icon: '📈',
  },
  {
    id: 402,
    name: 'Log Aggregator',
    description: 'Centralized log collection and analysis system',
    category: 'Data',
    projects: 167,
    icon: '📋',
  },
  {
    id: 403,
    name: 'Recommendation Engine',
    description: 'Collaborative filtering system for personalized suggestions',
    category: 'Data',
    projects: 82,
    icon: '👍',
  },
  {
    id: 404,
    name: 'IoT Data Stream',
    description: 'High-throughput ingestion for sensor data',
    category: 'Data',
    projects: 56,
    icon: '📡',
  },
  {
    id: 405,
    name: 'Data Scraper',
    description: 'Automated web scraping and data extraction tool',
    category: 'Data',
    projects: 123,
    icon: '🕷️',
  },

  // AI Category
  {
    id: 5,
    name: 'Machine Learning',
    description: 'ML model development and deployment template',
    category: 'AI',
    projects: 145,
    icon: '🤖',
  },
  {
    id: 501,
    name: 'Chatbot Assistant',
    description: 'Conversational AI agent aimed at customer support',
    category: 'AI',
    projects: 211,
    icon: '🗨️',
  },
  {
    id: 502,
    name: 'Image Recognition',
    description: 'Computer vision model for object detection and classification',
    category: 'AI',
    projects: 98,
    icon: '👁️',
  },
  {
    id: 503,
    name: 'NLP Processor',
    description: 'Natural language processing for sentiment analysis and summarization',
    category: 'AI',
    projects: 132,
    icon: '🧠',
  },
  {
    id: 504,
    name: 'Predictive Model',
    description: 'Forecasting engine for sales and trend analysis',
    category: 'AI',
    projects: 167,
    icon: '📉',
  },
  {
    id: 505,
    name: 'Voice Assistant',
    description: 'Speech-to-text and text-to-speech integration',
    category: 'AI',
    projects: 74,
    icon: '🎙️',
  },
];

const CATEGORIES = ['All', 'Web', 'Mobile', 'Backend', 'Data', 'AI'];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [displayLimit, setDisplayLimit] = useState(6);

  const filteredTemplates = (selectedCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory)
  ).slice(0, displayLimit === -1 ? undefined : displayLimit);

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
            <span className="gradient-text">Analysis Templates</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Use pre-built templates to quickly analyze common project types
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                    ? 'bg-neutral-900 dark:bg-accent text-white shadow-md'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-48">
            <Select
              value={displayLimit}
              onChange={(val) => setDisplayLimit(val)}
              options={[
                { label: 'Show 6', value: 6 },
                { label: 'Show 12', value: 12 },
                { label: 'Show 24', value: 24 },
                { label: 'Show All', value: -1 }
              ]}
              containerClassName="w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, i) => (
          <Card key={template.id} isHoverable className="animate-slide-up group overflow-hidden relative" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <CardBody className="space-y-4 relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">{template.icon}</div>
                  <h3 className="font-display font-700 text-lg text-neutral-900 dark:text-neutral-50 group-hover:text-accent transition-colors duration-300">
                    {template.name}
                  </h3>
                </div>
                <Badge variant="info">{template.category}</Badge>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {template.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  Used in {template.projects} projects
                </span>
                <Link href={`/create?template=${template.id}`}>
                  <Button size="sm">Use Template</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-12 text-neutral-500">
            No templates found for this category.
          </div>
        )}
      </div>
    </main>
  );
}
