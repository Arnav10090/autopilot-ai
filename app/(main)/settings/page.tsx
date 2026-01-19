'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { Select } from '@/components/ui/Select';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('sk_test_••••••••••••••••');
  const [showKey, setShowKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<any>({ name: '', email: '' });
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { language, setLanguage, t } = useLanguage();

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) return;
    
    const confirmed = window.confirm('Do you really want to change your password?');
    if (!confirmed) return;

    setPasswordStatus('saving');
    try {
      const res = await fetch('http://localhost:5000/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, new_password: newPassword })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      
      // Update local state to show new password
      setUser({ ...user, password: newPassword });
      setNewPassword('');
      setPasswordStatus('success');
      setTimeout(() => setPasswordStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Password change failed:', err);
      setPasswordStatus('error');
      setTimeout(() => setPasswordStatus('idle'), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/account/${user.id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete account');
      
      // Clear session and redirect to signin
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
    } catch (err: any) {
      console.error('Account deletion failed:', err);
      alert('Failed to delete account: ' + err.message);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      
      if (!parsed.id) {
          console.error("User ID missing in session:", parsed);
          setUser(parsed);
          return;
      }

      // Fetch fresh data from API
      fetch(`http://localhost:5000/api/auth/profile/${parsed.id}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                setUser(parsed); // Fallback
            } else {
                setUser({
                    ...data,
                    // Use hashed password as placeholder for "Current Password" field if desired, 
                    // or better, just keep it hidden/empty.
                    // But user specifically asked for "Password (hide/unhide)".
                    // The API returns password_hash now for this purpose.
                    password: data.password_hash 
                });
            }
        })
        .catch(err => {
            console.error("Failed to load profile", err);
            setUser(parsed);
        });
    }
  }, []);

  // Load and apply theme preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (selectedTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (selectedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as 'light' | 'dark' | 'system';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
          <span className="gradient-text">{t('settings')}</span>
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          {t('settingsSubtitle')}
        </p>
      </div>

      <div className="space-y-8">
        {/* Account Settings */}
        <div className="space-y-4">
          <div id="account" className="scroll-mt-24">
            <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
              {t('account')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('accountSubtitle')}
            </p>
          </div>

          <Card className="relative z-40">
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t('fullName')} placeholder="John Doe" value={user.name || ''} onChange={(e) => setUser({...user, name: e.target.value})} />
                <Input label={t('email')} type="email" placeholder="john@example.com" value={user.email || ''} onChange={(e) => setUser({...user, email: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label={t('dateOfBirth')} type="date" value={user.dob ? new Date(user.dob).toISOString().split('T')[0] : ''} onChange={(e) => setUser({...user, dob: e.target.value})} />
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 my-4 pt-4">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-4">{t('security')}</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('currentPassword')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={user.password || '********'}
                        readOnly
                        className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('changePassword')}
                    </label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter new password" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={handlePasswordChange}
                        disabled={!newPassword.trim() || passwordStatus === 'saving'}
                      >
                        {passwordStatus === 'saving' ? t('saving') : t('update')}
                      </Button>
                    </div>
                    {passwordStatus === 'success' && (
                      <p className="text-sm text-success">✓ Password updated successfully!</p>
                    )}
                    {passwordStatus === 'error' && (
                      <p className="text-sm text-danger">✗ Failed to update password</p>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button>{t('saveChanges')}</Button>
            </CardFooter>
          </Card>
        </div>

        {/* API Keys */}
        <div className="space-y-4">
          <div id="api-keys" className="scroll-mt-24">
            <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
              API Keys
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your API credentials for integrations
            </p>
          </div>

          <Card className="relative z-30">
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



        {/* Preferences */}
        <div className="space-y-4">
          <div id="preferences" className="scroll-mt-24">
            <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
              {t('preferences')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('preferencesSubtitle')}
            </p>
          </div>

          <Card className="relative z-20">
            <CardBody className="space-y-4">
              <div>
                <Select 
                  label={t('theme')}
                  value={theme}
                  onChange={(val: any) => handleThemeChange({ target: { value: val } } as any)}
                  options={[
                    { value: 'light', label: t('light') },
                    { value: 'dark', label: t('dark') },
                    { value: 'system', label: t('system') }
                  ]}
                />
              </div>

              <div>
                <Select 
                  label={t('language')}
                  value={language}
                  onChange={(val: any) => handleLanguageChange({ target: { value: val } } as any)}
                  options={[
                    { value: 'English', label: 'English' },
                    { value: 'Spanish', label: 'Spanish' },
                    { value: 'French', label: 'French' },
                    { value: 'German', label: 'German' }
                  ]}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <div id="danger-zone" className="scroll-mt-24">
            <h2 className="text-2xl font-display font-700 text-danger mb-2">
              {t('dangerZone')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('dangerZoneSubtitle')}
            </p>
          </div>

          <Card className="border-danger/30 bg-danger/5 relative z-10">
            <CardBody className="space-y-4">
              <Button variant="danger" className="w-full" onClick={handleDeleteAccount}>
                {t('deleteAccount')}
              </Button>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {t('deleteAccountWarning')}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
