import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
        hoverable && 'transition-shadow hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
};

// Alias CardBody to CardContent for backwards compatibility
export const CardBody = CardContent;

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Add component properties
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Content = CardContent;
Card.Footer = CardFooter;

const sharedPropTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.propTypes = {
  ...sharedPropTypes,
  hoverable: PropTypes.bool,
};

CardHeader.propTypes = sharedPropTypes;
CardContent.propTypes = sharedPropTypes;
CardBody.propTypes = sharedPropTypes;
CardFooter.propTypes = sharedPropTypes;

// Remove defaultProps
// Card.defaultProps = {
//   hoverable: false,
// }; 