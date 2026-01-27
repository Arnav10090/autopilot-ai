'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get user data from URL parameters
        const userParam = searchParams.get('user');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          // Authentication failed
          const errorMessages: { [key: string]: string } = {
            google_auth_failed: 'Google authentication failed. Please try again.',
            github_auth_failed: 'GitHub authentication failed. Please try again.',
          };

          setError(errorMessages[errorParam] || 'Authentication failed. Please try again.');

          // Redirect to signin after showing error
          setTimeout(() => {
            router.push('/auth/signin');
          }, 3000);
          return;
        }

        if (!userParam) {
          setError('No user data received. Please try again.');
          setTimeout(() => {
            router.push('/auth/signin');
          }, 3000);
          return;
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userParam));

        // Store user session
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to home page
        router.push('/');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('An error occurred during authentication. Please try again.');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-neutral-900 dark:bg-gradient-to-br dark:from-accent dark:to-accent-2 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-display font-bold text-lg">AP</span>
          </div>
        </div>

        <Card>
          <CardHeader
            title={error ? 'Authentication Failed' : 'Signing you in...'}
            subtitle={error ? '' : 'Please wait while we complete the authentication'}
          />

          <CardBody className="space-y-5">
            {error ? (
              <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg">
                <p className="text-sm text-danger font-medium">{error}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                  Redirecting to sign in page...
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div>Processing login...</div>}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
