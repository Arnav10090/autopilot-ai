'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Pill } from '@/components/ui/Pill';

const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Build a modern e-commerce solution with React and Node.js',
    status: 'In Progress',
    date: '2024-01-15',
    owner: 'John Doe',
    tags: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    description: 'Create a secure mobile banking application',
    status: 'Planning',
    date: '2024-01-10',
    owner: 'Jane Smith',
    tags: ['React Native', 'Firebase'],
  },
  {
    id: '3',
    title: 'AI Content Generator',
    description: 'Develop an AI-powered content generation platform',
    status: 'Completed',
    date: '2024-01-01',
    owner: 'John Doe',
    tags: ['Python', 'OpenAI', 'Vue.js'],
  },
  {
    id: '4',
    title: 'Real-time Collaboration Tool',
    description: 'Build a real-time document collaboration platform',
    status: 'In Progress',
    date: '2024-01-20',
    owner: 'Mike Johnson',
    tags: ['WebSocket', 'React', 'PostgreSQL'],
  },
];

type ViewMode = 'grid' | 'list';
type SortField = 'date' | 'title' | 'status';

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedProjects = useMemo(() => {
    let result = MOCK_PROJECTS;

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus) {
      result = result.filter((p) => p.status === selectedStatus);
    }

    // Sort
    result.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, selectedStatus, sortField, sortOrder]);

  const statuses = ['Planning', 'In Progress', 'Completed'];
  const statusColors: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
    'Planning': 'warning',
    'In Progress': 'info',
    'Completed': 'success',
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
              Projects
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Manage and track all your AI-analyzed projects
            </p>
          </div>
          <Link href="/create">
            <Button size="lg">Create Project</Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                  selectedStatus === status
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* View controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {filteredAndSortedProjects.length} project{filteredAndSortedProjects.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex border border-neutral-200 dark:border-neutral-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-accent text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-accent text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                aria-label="List view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects grid/list */}
      {filteredAndSortedProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProjects.map((project, index) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <Card
                  isHoverable
                  className="h-full animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardBody className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-display font-700 text-lg text-neutral-900 dark:text-neutral-50 line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between">
                        <Badge variant={statusColors[project.status]}>
                          {project.status}
                        </Badge>
                        <span className="text-xs text-neutral-500">
                          {new Date(project.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          by <strong>{project.owner}</strong>
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {project.tags.map((tag) => (
                            <Pill key={tag} variant="accent">
                              {tag}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('title')}
                      className="font-display font-700 text-neutral-900 dark:text-neutral-50 hover:text-accent transition-colors flex items-center gap-2"
                    >
                      Project
                      {sortField === 'title' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={sortOrder === 'asc' ? 'M7 14l5-5 5 5z' : 'M7 10l5 5 5-5z'} />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('status')}
                      className="font-display font-700 text-neutral-900 dark:text-neutral-50 hover:text-accent transition-colors flex items-center gap-2"
                    >
                      Status
                      {sortField === 'status' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={sortOrder === 'asc' ? 'M7 14l5-5 5 5z' : 'M7 10l5 5 5-5z'} />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="text-left p-4">Owner</th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('date')}
                      className="font-display font-700 text-neutral-900 dark:text-neutral-50 hover:text-accent transition-colors flex items-center gap-2"
                    >
                      Date
                      {sortField === 'date' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={sortOrder === 'asc' ? 'M7 14l5-5 5 5z' : 'M7 10l5 5 5-5z'} />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="text-right p-4">Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <Link href={`/project/${project.id}`} className="font-medium text-accent hover:text-accent-2 transition-colors">
                        {project.title}
                      </Link>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusColors[project.status]}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {project.owner}
                    </td>
                    <td className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(project.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-wrap gap-1 justify-end">
                        {project.tags.slice(0, 2).map((tag) => (
                          <Pill key={tag} variant="accent" className="text-xs">
                            {tag}
                          </Pill>
                        ))}
                        {project.tags.length > 2 && (
                          <Pill variant="default" className="text-xs">
                            +{project.tags.length - 2}
                          </Pill>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2m4-4l2 2m-2-2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
            No projects found
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Create your first project to get started'}
          </p>
          {!searchQuery && !selectedStatus && (
            <Link href="/create">
              <Button>Create Project</Button>
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
