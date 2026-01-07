'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { analyzeProject } from '@/services/api';
import { CreateProjectPayload } from '@/types/project';
import AgentProgress from '@/components/AgentProgress';

type Step = 'info' | 'team' | 'constraints' | 'quality' | 'review';

const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 'info', label: 'Project Info', icon: '📋' },
  { id: 'team', label: 'Team & Timeline', icon: '👥' },
  { id: 'constraints', label: 'Constraints', icon: '🔒' },
  { id: 'quality', label: 'Quality & Scope', icon: '⭐' },
  { id: 'review', label: 'Review', icon: '✓' },
];

export default function ProjectForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateProjectPayload>({
    project_description: '',
    team_size: 3,
    deadline: '3 months',
    skill_level: 'Intermediate',
    constraints: '',
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('project_draft', JSON.stringify(form));
  }, [form]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.project_description.trim()) {
      setError('Project description is required');
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisStep(0);

      setAnalysisStep(1);
      const result = await analyzeProject(form);

      setAnalysisStep(4);
      if (result && result.project_id) {
        localStorage.removeItem('project_draft');
        router.push(`/project/${result.project_id}`);
      } else {
        setError('Failed to create project. No project ID returned.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isStepValid = (step: Step) => {
    switch (step) {
      case 'info':
        return form.project_description.trim().length > 0;
      case 'team':
        return form.team_size > 0 && form.deadline.trim().length > 0;
      case 'constraints':
        return true; // Optional
      case 'quality':
        return true; // Optional
      case 'review':
        return true;
      default:
        return true;
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      {isAnalyzing && <AgentProgress currentStep={analysisStep} />}

      <div className="mb-8">
        <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
          Create Project Plan
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Let our AI agents analyze your project and create a comprehensive plan
        </p>
      </div>

      {/* Stepper */}
      <Card className="mb-8">
        <CardBody className="space-y-6">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Step {currentStepIndex + 1} of {STEPS.length}
              </span>
              <span className="text-sm font-medium text-accent">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className="grid grid-cols-5 gap-2">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
                  if (index <= stepIndex) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`p-3 rounded-lg text-center font-medium transition-all text-sm ${
                  step.id === currentStep
                    ? 'bg-accent text-white shadow-md'
                    : isStepValid(step.id)
                    ? 'bg-success/10 text-success dark:bg-success/20 hover:bg-success/20'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
                disabled={index > currentStepIndex}
              >
                <span className="block text-lg mb-1">{step.icon}</span>
                <span className="block">{step.label}</span>
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step: Project Info */}
        {currentStep === 'info' && (
          <Card className="animate-fade-in">
            <CardHeader title="Project Information" subtitle="Tell us about your project" />
            <CardBody className="space-y-4">
              <TextArea
                label="Project Description"
                name="project_description"
                placeholder="Describe your project idea, goals, key features, and any specific requirements..."
                value={form.project_description}
                onChange={handleInputChange}
                required
                disabled={isAnalyzing}
              />
            </CardBody>
          </Card>
        )}

        {/* Step: Team & Timeline */}
        {currentStep === 'team' && (
          <Card className="animate-fade-in">
            <CardHeader title="Team & Timeline" subtitle="Define your team size and project deadline" />
            <CardBody className="space-y-4">
              <Input
                label="Team Size"
                type="number"
                name="team_size"
                min="1"
                max="100"
                value={form.team_size}
                onChange={handleInputChange}
                required
                disabled={isAnalyzing}
              />

              <Input
                label="Deadline"
                type="text"
                name="deadline"
                placeholder="e.g., 3 months, 6 weeks, Q2 2024"
                value={form.deadline}
                onChange={handleInputChange}
                required
                disabled={isAnalyzing}
              />

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Team Skill Level
                </label>
                <select
                  name="skill_level"
                  value={form.skill_level}
                  onChange={handleInputChange}
                  disabled={isAnalyzing}
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Step: Constraints */}
        {currentStep === 'constraints' && (
          <Card className="animate-fade-in">
            <CardHeader
              title="Constraints & Requirements"
              subtitle="Specify any technical constraints or special requirements"
            />
            <CardBody className="space-y-4">
              <TextArea
                label="Constraints (Optional)"
                name="constraints"
                placeholder="List any budget limitations, technology restrictions, compliance requirements, or other constraints..."
                value={form.constraints}
                onChange={handleInputChange}
                disabled={isAnalyzing}
                helperText="This helps us recommend more suitable solutions for your project"
              />

              {/* Advanced options */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm font-medium text-accent hover:text-accent-2 transition-colors flex items-center gap-2"
                >
                  <span>{showAdvanced ? '▼' : '▶'}</span>
                  Advanced Options
                </button>

                {showAdvanced && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
                    <Input
                      label="Budget (Optional)"
                      type="text"
                      placeholder="e.g., $50,000, €100,000"
                      disabled={isAnalyzing}
                    />
                    <Input
                      label="Industry/Domain (Optional)"
                      type="text"
                      placeholder="e.g., FinTech, Healthcare, E-commerce"
                      disabled={isAnalyzing}
                    />
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Step: Quality & Scope */}
        {currentStep === 'quality' && (
          <Card className="animate-fade-in">
            <CardHeader
              title="Analysis Quality & Scope"
              subtitle="Choose the depth of analysis you'd like"
            />
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 border-2 border-accent rounded-lg bg-accent/5">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="quick"
                      name="quality"
                      value="quick"
                      defaultChecked
                      className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                    />
                    <label htmlFor="quick" className="flex-1 cursor-pointer">
                      <span className="font-medium text-neutral-900 dark:text-neutral-50">Quick Analysis</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Fast overview with basic recommendations (2-3 minutes)
                      </p>
                    </label>
                  </div>
                </div>

                <div className="p-4 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="balanced"
                      name="quality"
                      value="balanced"
                      className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                    />
                    <label htmlFor="balanced" className="flex-1 cursor-pointer">
                      <span className="font-medium text-neutral-900 dark:text-neutral-50">Balanced</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Comprehensive analysis with detailed recommendations (5-7 minutes)
                      </p>
                    </label>
                  </div>
                </div>

                <div className="p-4 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="complete"
                      name="quality"
                      value="complete"
                      className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                    />
                    <label htmlFor="complete" className="flex-1 cursor-pointer">
                      <span className="font-medium text-neutral-900 dark:text-neutral-50">Complete</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Deep dive analysis with extensive recommendations and risk assessment (10-15 minutes)
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Step: Review */}
        {currentStep === 'review' && (
          <Card className="animate-fade-in">
            <CardHeader title="Review Your Project" subtitle="Check all details before submitting" />
            <CardBody className="space-y-6">
              {error && (
                <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg">
                  <p className="text-sm text-danger font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Project Description</p>
                  <p className="font-medium text-neutral-900 dark:text-neutral-50">
                    {form.project_description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Team Size</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-50">
                      {form.team_size} {form.team_size === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                  <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Deadline</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-50">{form.deadline}</p>
                  </div>
                </div>

                <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Skill Level</p>
                  <Badge variant="info">{form.skill_level}</Badge>
                </div>

                {form.constraints && (
                  <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Constraints</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-50">
                      {form.constraints}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  ✓ Ready to submit your project for analysis. Our AI agents will create a comprehensive plan.
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Navigation */}
        <Card>
          <CardFooter divider={false}>
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStepIndex === 0 || isAnalyzing}
              >
                ← Previous
              </Button>

              {currentStep === 'review' ? (
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isAnalyzing}
                  disabled={!isStepValid(currentStep) || isAnalyzing}
                >
                  Generate Plan
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep) || isAnalyzing}
                >
                  Next →
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
