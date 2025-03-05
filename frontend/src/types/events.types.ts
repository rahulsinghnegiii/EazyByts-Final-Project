export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  venue: Venue;
  category: Category;
  organizer: User;
  ticketTypes: TicketType[];
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  amenities: string[];
  imageUrls: string[];
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  maxPerOrder?: number;
  salesStart?: string;
  salesEnd?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  event: Event;
  user: User;
  tickets: BookedTicket[];
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookedTicket {
  id: string;
  ticketType: TicketType;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'; 