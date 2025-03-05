import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({
  children,
  type = 'button',
  className = '',
  variant = 'default',
  size = 'default',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80',
    outline: 'border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-50',
    link: 'text-gray-900 underline-offset-4 hover:underline dark:text-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : LeftIcon ? (
        <LeftIcon className="mr-2 h-4 w-4" />
      ) : null}
      {children}
      {RightIcon && !isLoading && <RightIcon className="ml-2 h-4 w-4" />}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'outline', 'ghost', 'link', 'danger']),
  size: PropTypes.oneOf(['default', 'sm', 'lg', 'icon']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  leftIcon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
}; 