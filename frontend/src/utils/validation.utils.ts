import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Event schemas
export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date',
  }),
  venueId: z.string().min(1, 'Please select a venue'),
  categoryId: z.string().min(1, 'Please select a category'),
  ticketTypes: z.array(z.object({
    name: z.string().min(1, 'Ticket type name is required'),
    price: z.number().min(0, 'Price must be greater than or equal to 0'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  })).min(1, 'At least one ticket type is required'),
  image: z.any().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Venue schemas
export const venueSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  images: z.array(z.any()).optional(),
});

// Booking schemas
export const bookingSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  tickets: z.array(z.object({
    ticketTypeId: z.string().min(1, 'Ticket type is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  })).min(1, 'At least one ticket is required'),
});

// Profile schemas
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  avatar: z.any().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
}); 