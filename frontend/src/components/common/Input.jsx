import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

export const Input = forwardRef(
  (
    {
      label,
      helperText,
      error,
      className,
      type = 'text',
      id,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          className={cn(
            'block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400',
            'dark:focus:border-blue-500 dark:focus:ring-blue-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          required={required}
          {...props}
        />
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600 dark:text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool,
}; 