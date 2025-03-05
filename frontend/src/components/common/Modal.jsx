import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { FaTimes } from 'react-icons/fa';

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  className,
  size = 'default',
  showClose = true,
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    small: 'max-w-md',
    default: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-lg shadow-xl ${sizes[size]} w-full dark:bg-gray-800`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
              id="modal-title"
            >
              {title}
            </h3>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {title && (
              <div className="space-y-1.5">
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'large', 'xlarge', 'full']),
  showClose: PropTypes.bool,
  className: PropTypes.string,
}; 