import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export const Footer: React.FC = () => {
  const navigation = {
    main: [
      { name: 'About', href: '/about' },
      { name: 'Events', href: '/events' },
      { name: 'Venues', href: '/venues' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    social: [
      {
        name: 'Facebook',
        href: '#',
        icon: FaFacebook,
      },
      {
        name: 'Twitter',
        href: '#',
        icon: FaTwitter,
      },
      {
        name: 'Instagram',
        href: '#',
        icon: FaInstagram,
      },
      {
        name: 'LinkedIn',
        href: '#',
        icon: FaLinkedin,
      },
    ],
  };

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link
                to={item.href}
                className="text-sm leading-6 text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} EventXpert. All rights reserved.
        </p>
      </div>
    </footer>
  );
}; 