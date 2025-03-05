import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaChartLine,
} from 'react-icons/fa';
import { Card } from '../../components/common/Card';

export const Dashboard = () => {
  // Mock data - replace with actual data from your API
  const stats = [
    {
      name: 'Total Events',
      value: '156',
      icon: FaCalendarAlt,
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Active Bookings',
      value: '89',
      icon: FaTicketAlt,
      change: '+23%',
      changeType: 'increase',
    },
    {
      name: 'Available Venues',
      value: '34',
      icon: FaMapMarkerAlt,
      change: '+4%',
      changeType: 'increase',
    },
    {
      name: 'Total Users',
      value: '2.4k',
      icon: FaUsers,
      change: '+18%',
      changeType: 'increase',
    },
  ];

  const recentEvents = [
    {
      id: 1,
      name: 'Tech Conference 2024',
      date: '2024-03-15',
      time: '09:00 AM',
      venue: 'Convention Center',
      status: 'upcoming',
      attendees: 450,
    },
    {
      id: 2,
      name: 'Music Festival',
      date: '2024-03-20',
      time: '04:00 PM',
      venue: 'City Park',
      status: 'upcoming',
      attendees: 2000,
    },
    {
      id: 3,
      name: 'Business Workshop',
      date: '2024-03-10',
      time: '10:00 AM',
      venue: 'Business Center',
      status: 'completed',
      attendees: 120,
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      eventName: 'Tech Conference 2024',
      userName: 'John Doe',
      date: '2024-03-15',
      status: 'confirmed',
      ticketType: 'VIP',
    },
    {
      id: 2,
      eventName: 'Music Festival',
      userName: 'Jane Smith',
      date: '2024-03-20',
      status: 'pending',
      ticketType: 'Regular',
    },
    {
      id: 3,
      eventName: 'Business Workshop',
      userName: 'Mike Johnson',
      date: '2024-03-10',
      status: 'confirmed',
      ticketType: 'Early Bird',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Link
          to="/events/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} variant="default" className="relative">
              <Card.Body>
                <div className="flex items-center">
                  <div className="flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div
                    className={`inline-flex items-center text-sm ${
                      stat.changeType === 'increase'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    <FaChartLine className="mr-1 h-4 w-4" />
                    {stat.change} from last month
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* Recent Events and Upcoming Bookings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Events */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium text-gray-900">Recent Events</h2>
          </Card.Header>
          <Card.Body>
            <div className="divide-y divide-gray-200">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {event.name}
                    </p>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      {event.date}
                      <FaClock className="ml-4 mr-1.5 h-4 w-4 flex-shrink-0" />
                      {event.time}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      {event.venue}
                      <FaUsers className="ml-4 mr-1.5 h-4 w-4 flex-shrink-0" />
                      {event.attendees} attendees
                    </div>
                  </div>
                  <div
                    className={`ml-4 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === 'upcoming'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.status}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/events"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all events
              </Link>
            </div>
          </Card.Body>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium text-gray-900">
              Upcoming Bookings
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="divide-y divide-gray-200">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {booking.eventName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Booked by {booking.userName}
                    </p>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      {booking.date}
                      <span className="ml-4 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {booking.ticketType}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`ml-4 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/bookings"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all bookings
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}; 