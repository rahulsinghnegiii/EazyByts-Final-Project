import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaDollarSign,
  FaTicketAlt,
  FaShare,
  FaHeart,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const EventDetails = () => {
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Mock data - replace with actual data from your API
  const event = {
    id,
    name: 'Tech Conference 2024',
    description:
      'Join us for the biggest tech conference of the year! Learn from industry experts, network with peers, and discover the latest innovations in technology.',
    date: '2024-03-15',
    time: '09:00 AM',
    endTime: '05:00 PM',
    venue: 'Convention Center',
    location: 'New York, NY',
    organizer: {
      name: 'Tech Events Inc.',
      email: 'contact@techevents.com',
      phone: '+1 (555) 123-4567',
    },
    price: 299,
    capacity: 500,
    registered: 450,
    image: 'https://via.placeholder.com/800x400',
    status: 'upcoming',
    ticketTypes: [
      {
        id: 1,
        name: 'Early Bird',
        price: 199,
        available: 0,
        description: 'Limited early bird tickets at a special price',
      },
      {
        id: 2,
        name: 'Regular',
        price: 299,
        available: 30,
        description: 'Standard conference admission',
      },
      {
        id: 3,
        name: 'VIP',
        price: 499,
        available: 10,
        description: 'VIP access with exclusive perks',
      },
    ],
    schedule: [
      {
        time: '09:00 AM',
        title: 'Registration & Breakfast',
        description: 'Check-in and enjoy complimentary breakfast',
      },
      {
        time: '10:00 AM',
        title: 'Keynote Speech',
        description: 'Opening keynote by industry leader',
      },
      {
        time: '11:30 AM',
        title: 'Technical Sessions',
        description: 'Multiple tracks of technical presentations',
      },
      {
        time: '01:00 PM',
        title: 'Lunch Break',
        description: 'Networking lunch with attendees',
      },
      {
        time: '02:00 PM',
        title: 'Workshops',
        description: 'Hands-on workshops in different tracks',
      },
      {
        time: '04:00 PM',
        title: 'Panel Discussion',
        description: 'Expert panel on future of technology',
      },
      {
        time: '05:00 PM',
        title: 'Closing Remarks',
        description: 'Conference wrap-up and networking',
      },
    ],
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Deleting event:', id);
    setShowDeleteModal(false);
  };

  const handleBooking = () => {
    // TODO: Implement booking functionality
    console.log('Booking ticket:', {
      eventId: id,
      ticketType: selectedTicketType,
      quantity,
    });
    setShowBookingModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="relative h-96">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">{event.name}</h1>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 h-5 w-5" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2 h-5 w-5" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 h-5 w-5" />
                  {event.venue}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-white border-white">
                <FaShare className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" className="text-white border-white">
                <FaHeart className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">About This Event</h2>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-600">{event.description}</p>
            </Card.Body>
          </Card>

          {/* Schedule */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Event Schedule</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6">
                {event.schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 pb-6 last:pb-0 last:border-0 border-b border-gray-200"
                  >
                    <div className="flex-none">
                      <div className="w-16 text-sm font-medium text-gray-600">
                        {item.time}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Organizer */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Organizer</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{event.organizer.name}</p>
                <p className="text-gray-600">{event.organizer.email}</p>
                <p className="text-gray-600">{event.organizer.phone}</p>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Information */}
          <Card>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <FaUsers className="mr-2 h-5 w-5" />
                    <span>
                      {event.registered}/{event.capacity} registered
                    </span>
                  </div>
                  <div
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === 'upcoming'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.status}
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-4">
                  <h3 className="text-lg font-medium mb-4">Available Tickets</h3>
                  <div className="space-y-4">
                    {event.ticketTypes.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{ticket.name}</p>
                          <p className="text-sm text-gray-600">
                            {ticket.description}
                          </p>
                          <p className="text-sm text-gray-600">
                            {ticket.available} tickets left
                          </p>
                        </div>
                        <div className="text-lg font-medium">${ticket.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setShowBookingModal(true)}
                  disabled={event.status !== 'upcoming'}
                >
                  <FaTicketAlt className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Admin Actions */}
          <Card>
            <Card.Body>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  fullWidth
                  as={Link}
                  to={`/events/${id}/edit`}
                >
                  <FaEdit className="mr-2 h-4 w-4" />
                  Edit Event
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FaTrash className="mr-2 h-4 w-4" />
                  Delete Event
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book Tickets"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Ticket Type
            </label>
            <select
              value={selectedTicketType?.id || ''}
              onChange={(e) =>
                setSelectedTicketType(
                  event.ticketTypes.find(
                    (t) => t.id === parseInt(e.target.value)
                  )
                )
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select a ticket type</option>
              {event.ticketTypes.map((ticket) => (
                <option
                  key={ticket.id}
                  value={ticket.id}
                  disabled={ticket.available === 0}
                >
                  {ticket.name} - ${ticket.price}
                  {ticket.available === 0 ? ' (Sold Out)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max={selectedTicketType?.available || 1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>

          {selectedTicketType && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-lg font-medium">
                <span>Total:</span>
                <span>${selectedTicketType.price * quantity}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleBooking}
              disabled={!selectedTicketType}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 