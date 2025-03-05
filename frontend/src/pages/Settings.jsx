import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Switch } from '@headlessui/react';
import {
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SettingsSection = ({ icon: Icon, title, children }) => (
  <Card className="overflow-hidden bg-white">
    <CardHeader className="border-b bg-gray-50">
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
    </CardHeader>
    <CardContent className="p-6 bg-white">{children}</CardContent>
  </Card>
);

const ToggleItem = ({ label, description, enabled, onChange }) => (
  <Switch.Group>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Switch.Label className="text-sm font-medium text-gray-900">
          {label}
        </Switch.Label>
        {description && (
          <Switch.Description className="text-sm text-gray-500">
            {description}
          </Switch.Description>
        )}
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  </Switch.Group>
);

export const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      eventReminders: true,
      marketing: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
    },
    theme: {
      darkMode: false,
      highContrast: false,
    },
    language: 'en',
  });

  const handleNotificationChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
    toast.success('Notification settings updated');
  };

  const handlePrivacyChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
    toast.success('Privacy settings updated');
  };

  const handleThemeChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: value,
      },
    }));
    toast.success('Theme settings updated');
  };

  return (
    <div className="space-y-6 max-w-4xl bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white">
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <SettingsSection icon={BellIcon} title="Notifications">
          <div className="space-y-4">
            <ToggleItem
              label="Email Notifications"
              description="Receive email updates about your events"
              enabled={settings.notifications.email}
              onChange={(value) => handleNotificationChange('email', value)}
            />
            <ToggleItem
              label="Push Notifications"
              description="Get instant notifications on your device"
              enabled={settings.notifications.push}
              onChange={(value) => handleNotificationChange('push', value)}
            />
            <ToggleItem
              label="Event Reminders"
              description="Receive reminders before your events"
              enabled={settings.notifications.eventReminders}
              onChange={(value) => handleNotificationChange('eventReminders', value)}
            />
            <ToggleItem
              label="Marketing Updates"
              description="Stay updated with our latest features and news"
              enabled={settings.notifications.marketing}
              onChange={(value) => handleNotificationChange('marketing', value)}
            />
          </div>
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection icon={ShieldCheckIcon} title="Privacy">
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Profile Visibility
              </label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) =>
                  handlePrivacyChange('profileVisibility', e.target.value)
                }
                className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
            <ToggleItem
              label="Show Email Address"
              enabled={settings.privacy.showEmail}
              onChange={(value) => handlePrivacyChange('showEmail', value)}
            />
            <ToggleItem
              label="Show Phone Number"
              enabled={settings.privacy.showPhone}
              onChange={(value) => handlePrivacyChange('showPhone', value)}
            />
          </div>
        </SettingsSection>

        {/* Theme */}
        <SettingsSection icon={PaintBrushIcon} title="Appearance">
          <div className="space-y-4">
            <ToggleItem
              label="Dark Mode"
              description="Use dark theme across the application"
              enabled={settings.theme.darkMode}
              onChange={(value) => handleThemeChange('darkMode', value)}
            />
            <ToggleItem
              label="High Contrast"
              description="Increase contrast for better visibility"
              enabled={settings.theme.highContrast}
              onChange={(value) => handleThemeChange('highContrast', value)}
            />
          </div>
        </SettingsSection>

        {/* Language */}
        <SettingsSection icon={GlobeAltIcon} title="Language & Region">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, language: e.target.value }))
              }
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}; 