'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';

export function Toggle({ label, description, defaultChecked }: any) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
      <div>
        <p className="font-medium text-neutral-900 dark:text-neutral-50">{label}</p>
        {description && <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>}
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          enabled ? 'bg-accent' : 'bg-neutral-300 dark:bg-neutral-700'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('sk_test_••••••••••••••••');
  const [showKey, setShowKey] = useState(false);

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
          Settings
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Manage your account preferences and configuration
        </p>
      </div>

      <div className="space-y-8">
        {/* Account Settings */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
              Account
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your account information
            </p>
          </div>

          <Card>
            <CardBody className="space-y-4">
              <Input label="Full Name" placeholder="John Doe" />
              <Input label="Email" type="email" placeholder="john@example.com" />
              <Input label="Organization" placeholder="Acme Inc." />
            </CardBody>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>

        {/* API Keys */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
              API Keys
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your API credentials for integrations
            </p>
          </div>

          <Card>
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  API Key
                </p>
                <div className="flex gap-2">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    readOnly
                    className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? '🙈 Hide' : '👁️ Show'}
                  </Button>
                  <Button variant="outline">📋 Copy</Button>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="space-x-3 flex">
                <Button variant="outline">Rotate Key</Button>
                <Button variant="danger">Revoke Key</Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
              Notifications
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Control how and when you receive notifications
            </p>
          </div>

          <Card>
            <CardBody className="space-y-3">
              <Toggle label="Email Notifications" description="Receive updates via email" defaultChecked={true} />
              <Toggle label="Analysis Complete" description="Notify when analysis finishes" defaultChecked={true} />
              <Toggle label="Weekly Digest" description="Get a weekly summary of activity" defaultChecked={false} />
            </CardBody>
          </Card>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
              Preferences
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Customize your experience
            </p>
          </div>

          <Card>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Theme
                </label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Language
                </label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-display font-700 text-danger mb-2">
              Danger Zone
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Irreversible actions
            </p>
          </div>

          <Card className="border-danger/30 bg-danger/5">
            <CardBody className="space-y-4">
              <Button variant="danger" className="w-full">
                Delete Account
              </Button>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
