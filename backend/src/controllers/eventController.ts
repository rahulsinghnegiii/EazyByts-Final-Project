import { Request, Response } from 'express';
import { Event } from '../models/Event';
import mongoose from 'mongoose';
import { NotificationService } from '../services/notification';
import { socketService } from '../services/socket';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const notificationService = new NotificationService();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/events';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req: Request, res: Response) => {
  try {
    const eventData = {
      ...req.body,
      creator: req.user._id,
    };

    // Handle file upload
    if (req.file) {
      eventData.image = `/uploads/events/${req.file.filename}`;
    }

    const event = await Event.create(eventData);

    // Emit socket event for real-time updates
    socketService.notifyNewEvent(event);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      category,
      status,
      search,
      page = 1,
      limit = 10,
      sort = '-startDate',
    } = req.query;

    // Build query
    const query: any = {};

    // Date range filter
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate as string);
      if (endDate) query.startDate.$lte = new Date(endDate as string);
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // If user is not admin, only show published events or their own events
    if (!req.user?.role?.includes('admin')) {
      query.$or = [
        { status: 'published', visibility: 'public' },
        { creator: req.user?._id },
      ];
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    const events = await Event.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('creator', 'name email')
      .populate('attendees', 'name email');

    // Get total count for pagination
    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('attendees', 'name email')
      .populate('comments.user', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Increment views
    event.analytics.views += 1;
    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is authorized
    if (event.creator.toString() !== req.user._id.toString() && !req.user.role.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    const updateData = { ...req.body };

    // Handle file upload
    if (req.file) {
      // Delete old image if it exists
      if (event.image) {
        const oldImagePath = path.join(__dirname, '..', '..', event.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/events/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    // Notify attendees about the update
    await notificationService.sendEventUpdateNotification(updatedEvent, 'Event Updated');
    
    // Emit socket event
    socketService.notifyEventUpdate(req.params.id, updatedEvent);

    res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is authorized
    if (event.creator.toString() !== req.user._id.toString() && !req.user.role.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await event.remove();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (!event.canRegister(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for this event',
      });
    }

    event.attendees.push(req.user._id);
    event.analytics.registrations += 1;
    await event.save();

    // Send registration confirmation
    await notificationService.sendRegistrationConfirmation(event, req.user);
    
    // Emit socket event
    socketService.notifyNewRegistration(req.params.id, {
      event,
      user: { id: req.user._id, name: req.user.name },
    });

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      data: event,
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error.message,
    });
  }
};

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Private
export const cancelEventRegistration = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const attendeeIndex = event.attendees.indexOf(req.user._id);
    if (attendeeIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Not registered for this event',
      });
    }

    event.attendees.splice(attendeeIndex, 1);
    event.analytics.registrations -= 1;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully cancelled event registration',
      data: event,
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling registration',
      error: error.message,
    });
  }
};

// @desc    Get events for a specific date
// @route   GET /api/events/date/:date
// @access  Public
export const getEventsByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const events = await Event.find({
      startDate: { $gte: startOfDay, $lte: endOfDay },
      $or: [
        { status: 'published', visibility: 'public' },
        { creator: req.user?._id },
      ],
    }).populate('creator', 'name email');

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Get events by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events for date',
      error: error.message,
    });
  }
};

// @desc    Add comment to event
// @route   POST /api/events/:id/comments
// @access  Private
export const addEventComment = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const comment = {
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date(),
    };

    event.comments.push(comment);
    await event.save();

    const populatedEvent = await Event.findById(req.params.id)
      .populate('comments.user', 'name email');

    // Emit socket event
    socketService.notifyNewComment(req.params.id, {
      comment,
      user: { id: req.user._id, name: req.user.name },
    });

    res.status(200).json({
      success: true,
      data: populatedEvent,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message,
    });
  }
};

// @desc    Toggle like event
// @route   POST /api/events/:id/likes
// @access  Private
export const toggleEventLike = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const likeIndex = event.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      event.likes.push(req.user._id);
    } else {
      event.likes.splice(likeIndex, 1);
    }

    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message,
    });
  }
}; 