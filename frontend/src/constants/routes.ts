export const ROUTES = {
  HOME: '/',
  
  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Event routes
  EVENTS: {
    LIST: '/events',
    DETAILS: '/events/:id',
    CREATE: '/events/create',
    EDIT: '/events/:id/edit',
    MY_EVENTS: '/events/my-events',
  },
  
  // Venue routes
  VENUES: {
    LIST: '/venues',
    DETAILS: '/venues/:id',
    CREATE: '/venues/create',
    EDIT: '/venues/:id/edit',
    MY_VENUES: '/venues/my-venues',
  },
  
  // Booking routes
  BOOKINGS: {
    LIST: '/bookings',
    DETAILS: '/bookings/:id',
    CREATE: '/events/:eventId/book',
    MY_BOOKINGS: '/bookings/my-bookings',
  },
  
  // User routes
  USER: {
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },
  
  // Static pages
  STATIC: {
    ABOUT: '/about',
    CONTACT: '/contact',
    PRIVACY: '/privacy',
    TERMS: '/terms',
  },
} as const;

// Helper function to generate dynamic routes
export const generatePath = {
  eventDetails: (id: string) => ROUTES.EVENTS.DETAILS.replace(':id', id),
  eventEdit: (id: string) => ROUTES.EVENTS.EDIT.replace(':id', id),
  venueDetails: (id: string) => ROUTES.VENUES.DETAILS.replace(':id', id),
  venueEdit: (id: string) => ROUTES.VENUES.EDIT.replace(':id', id),
  bookingDetails: (id: string) => ROUTES.BOOKINGS.DETAILS.replace(':id', id),
  createBooking: (eventId: string) => ROUTES.BOOKINGS.CREATE.replace(':eventId', eventId),
}; 