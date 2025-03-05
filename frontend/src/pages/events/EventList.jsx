import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaSort,
} from 'react-icons/fa';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const EventList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual data from your API
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'conference', name: 'Conferences' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'concert', name: 'Concerts' },
    { id: 'exhibition', name: 'Exhibitions' },
    { id: 'sports', name: 'Sports' },
  ];

  const events = [
    {
      id: 1,
      name: 'Tech Conference 2024',
      category: 'conference',
      date: '2024-03-15',
      time: '09:00 AM',
      venue: 'Convention Center',
      location: 'New York, NY',
      price: 299,
      capacity: 500,
      registered: 450,
      image: 'https://via.placeholder.com/400x200',
      status: 'upcoming',
    },
    {
      id: 2,
      name: 'Music Festival',
      category: 'concert',
      date: '2024-03-20',
      time: '04:00 PM',
      venue: 'City Park',
      location: 'Los Angeles, CA',
      price: 149,
      capacity: 2000,
      registered: 1800,
      image: 'https://via.placeholder.com/400x200',
      status: 'upcoming',
    },
    {
      id: 3,
      name: 'Business Workshop',
      category: 'workshop',
      date: '2024-03-10',
      time: '10:00 AM',
      venue: 'Business Center',
      location: 'Chicago, IL',
      price: 199,
      capacity: 150,
      registered: 120,
      image: 'https://via.placeholder.com/400x200',
      status: 'completed',
    },
  ];

  // Filter and sort events
  const filteredEvents = events
    .filter((event) => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
        <Link
          to="/events/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Event
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto"
          >
            <FaFilter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="date"
              label="Start Date"
              name="startDate"
              className="w-full"
            />
            <Input
              type="date"
              label="End Date"
              name="endDate"
              className="w-full"
            />
            <Input
              type="number"
              label="Min Price"
              name="minPrice"
              className="w-full"
            />
            <Input
              type="number"
              label="Max Price"
              name="maxPrice"
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} hoverable={true}>
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {event.name}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-1.5 h-4 w-4 flex-shrink-0" />
                    {event.date}
                    <FaClock className="ml-4 mr-1.5 h-4 w-4 flex-shrink-0" />
                    {event.time}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  {event.venue}, {event.location}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaUsers className="mr-1.5 h-4 w-4 flex-shrink-0" />
                    {event.registered}/{event.capacity} registered
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    ${event.price}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === 'upcoming'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.status}
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
          <p className="mt-1 text-sm text-gray-500">
            No events match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}; 