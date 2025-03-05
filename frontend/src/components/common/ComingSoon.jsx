import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaTools } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Button } from './Button';

export const ComingSoon = ({
  feature = 'This feature',
  message = 'is coming soon!',
}) => {
  const notify = () => {
    toast.success(`We'll notify you when ${feature.toLowerCase()} are available!`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <FaTools className="w-16 h-16 text-blue-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {feature} {message}
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-md">
        We're working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div className="mt-8 space-x-4">
        <Button onClick={notify}>Notify Me</Button>
        <Button variant="outline" as={Link} to="/">
          Go Home
        </Button>
      </div>
    </div>
  );
};

ComingSoon.propTypes = {
  feature: PropTypes.string,
  message: PropTypes.string,
}; 