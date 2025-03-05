import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FaCalendar,
  FaMapPin,
  FaBookmark,
  FaUser,
  FaCog,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const NavItem = ({ to, icon: Icon, children, isActive }) => (
  <Link
    to={to}
    className={cn(
      'flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    )}
  >
    <Icon className="h-5 w-5" />
    <span>{children}</span>
  </Link>
);

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-border z-50 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static dark:bg-gray-800 dark:border-gray-700',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border md:hidden dark:border-gray-700">
          <span className="text-xl font-bold text-primary">EventXpert</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <NavItem to="/events" icon={FaCalendar} isActive={isActive('/events')}>
            Events
          </NavItem>
          <NavItem to="/venues" icon={FaMapPin} isActive={isActive('/venues')}>
            Venues
          </NavItem>
          {user && (
            <>
              <NavItem to="/bookings" icon={FaBookmark} isActive={isActive('/bookings')}>
                My Bookings
              </NavItem>
              <NavItem to="/profile" icon={FaUser} isActive={isActive('/profile')}>
                Profile
              </NavItem>
              <NavItem to="/settings" icon={FaCog} isActive={isActive('/settings')}>
                Settings
              </NavItem>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}; 