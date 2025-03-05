import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock user data - replace with actual user data from your auth context
  const user = {
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/32',
  };

  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}; 