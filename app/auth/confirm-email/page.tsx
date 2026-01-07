'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';

export default function ConfirmEmailPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Implement actual email verification logic
      if (code.length !== 6) {
        setError('Code must be 6 digits');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVerified(true);
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      // TODO: Implement actual resend logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResendCooldown(60);
    } finally {
      setResendLoading(false);
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
          {!verified ? (
            <>
              <CardHeader
                title="Verify Email"
                subtitle="Enter the verification code sent to your email"
              />

              <CardBody className="space-y-5">
                {error && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg">
                    <p className="text-sm text-danger font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Verification Code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    required
                    disabled={isLoading}
                    helperText="Enter the 6-digit code from your email"
                  />

                  <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                    Verify Email
                  </Button>
                </form>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || resendLoading}
                    isLoading={resendLoading}
                    className="w-full"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </Button>
                </div>
              </CardBody>
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
                  Email Verified
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Your email has been successfully verified. You can now access your account.
                </p>
              </div>

              <Link href="/projects">
                <Button size="lg" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
