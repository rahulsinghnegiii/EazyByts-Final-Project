import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaSun,
  FaMoon,
} from 'react-icons/fa';

export const Header = ({ onMenuClick, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              onClick={onMenuClick}
            >
              <FaBars className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-3 ml-4 lg:ml-0">
              <span className="text-xl font-bold text-blue-600">EventXpert</span>
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-500"
                >
                  <FaBell className="h-6 w-6" />
                </button>
                <div className="relative ml-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex-shrink-0 text-gray-400 hover:text-gray-500"
                    >
                      <FaUserCircle className="h-8 w-8" />
                    </Link>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}; 