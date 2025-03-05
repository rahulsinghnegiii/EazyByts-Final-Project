import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  category: string;
  image?: string;
  capacity: number;
  price: number;
  isPublic: boolean;
  registrationDeadline: Date;
  creator: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
  comments: {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  likes: mongoose.Types.ObjectId[];
  tags: string[];
  reminders: {
    type: string;
    time: number; // minutes before event
  }[];
  analytics: {
    views: number;
    registrations: number;
    shares: number;
  };
  status: 'draft' | 'published' | 'cancelled';
  canRegister(userId: mongoose.Types.ObjectId): boolean;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
      maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide event start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide event end date'],
    },
    location: {
      name: {
        type: String,
        required: [true, 'Please provide location name'],
      },
      address: {
        type: String,
        required: [true, 'Please provide location address'],
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    category: {
      type: String,
      required: [true, 'Please provide event category'],
      enum: ['conference', 'workshop', 'seminar', 'networking', 'other'],
    },
    image: {
      type: String,
      default: null,
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide event capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Please provide registration deadline'],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: {
        type: String,
        required: true,
        maxlength: [500, 'Comment cannot be more than 500 characters'],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    tags: [String],
    reminders: [{
      type: {
        type: String,
        enum: ['email', 'notification'],
        required: true,
      },
      time: {
        type: Number,
        required: true,
        min: [0, 'Reminder time cannot be negative'],
      },
    }],
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      registrations: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if a user can register for the event
eventSchema.methods.canRegister = function(userId: mongoose.Types.ObjectId): boolean {
  // Check if user is already registered
  if (this.attendees.includes(userId)) {
    return false;
  }

  // Check if event is full
  if (this.attendees.length >= this.capacity) {
    return false;
  }

  // Check if registration deadline has passed
  if (new Date() > this.registrationDeadline) {
    return false;
  }

  // Check if event is cancelled
  if (this.status === 'cancelled') {
    return false;
  }

  return true;
};

// Middleware to validate dates
eventSchema.pre('save', function(next) {
  if (this.startDate > this.endDate) {
    next(new Error('End date must be after start date'));
  }
  if (this.registrationDeadline > this.startDate) {
    next(new Error('Registration deadline must be before event start date'));
  }
  next();
});

export const Event = mongoose.model<IEvent>('Event', eventSchema); 