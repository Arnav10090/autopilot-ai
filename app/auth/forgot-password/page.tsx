'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement actual password reset logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8 group">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-2 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
            <span className="text-white font-display font-bold text-lg">AP</span>
          </div>
        </Link>

        <Card>
          {!submitted ? (
            <>
              <CardHeader
                title="Reset Password"
                subtitle="Enter your email to receive a password reset link"
              />

              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    helperText="We'll send you a link to reset your password"
                  />

                  <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                    Send Reset Link
                  </Button>
                </form>
              </CardBody>

              <CardFooter divider={false}>
                <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                  Remember your password?{' '}
                  <Link
                    href="/auth/signin"
                    className="text-accent hover:text-accent-2 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </>
          ) : (
            <div className="space-y-6 py-8">
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="font-display font-700 text-lg text-neutral-900 dark:text-neutral-50">
                  Check your email
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3 text-sm">
                <p className="font-medium text-neutral-900 dark:text-neutral-50">
                  Didn't receive an email?
                </p>
                <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 list-disc list-inside">
                  <li>Check your spam folder</li>
                  <li>Verify the email address is correct</li>
                  <li>Wait a few moments and refresh</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSubmitted(false)}
                  className="w-full"
                >
                  Try Another Email
                </Button>
                <Link href="/auth/signin" className="block">
                  <Button variant="ghost" size="lg" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
