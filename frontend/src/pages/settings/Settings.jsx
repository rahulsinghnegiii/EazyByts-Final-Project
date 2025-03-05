import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { FaMoon, FaSun, FaBell } from 'react-icons/fa';

export const Settings = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    marketing: false,
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', !darkMode);
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Appearance */}
        <Card>
          <Card.Body>
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {darkMode ? <FaMoon className="h-5 w-5" /> : <FaSun className="h-5 w-5" />}
                <span>Dark Mode</span>
              </div>
              <Button
                variant={darkMode ? "primary" : "outline"}
                onClick={toggleDarkMode}
              >
                {darkMode ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Notifications */}
        <Card>
          <Card.Body>
            <div className="flex items-center space-x-2 mb-4">
              <FaBell className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about your events</p>
                </div>
                <Button
                  variant={notifications.email ? "primary" : "outline"}
                  onClick={() => handleNotificationChange('email')}
                >
                  {notifications.email ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive push notifications about your events</p>
                </div>
                <Button
                  variant={notifications.push ? "primary" : "outline"}
                  onClick={() => handleNotificationChange('push')}
                >
                  {notifications.push ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Communications</p>
                  <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                </div>
                <Button
                  variant={notifications.marketing ? "primary" : "outline"}
                  onClick={() => handleNotificationChange('marketing')}
                >
                  {notifications.marketing ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Account Preferences */}
        <Card>
          <Card.Body>
            <h2 className="text-xl font-semibold mb-4">Account Preferences</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Time Zone</p>
                <p className="text-sm text-gray-500">Your current time zone is: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              </div>
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-gray-500">Your current language is: English</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Danger Zone */}
        <Card>
          <Card.Body>
            <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-gray-500">Once you delete your account, there is no going back. Please be certain.</p>
                <Button
                  variant="danger"
                  className="mt-2"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      // Handle account deletion
                      console.log('Account deletion requested');
                    }
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}; 