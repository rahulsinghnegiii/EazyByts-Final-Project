import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

export const Loading = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent text-blue-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  text: PropTypes.string,
}; 