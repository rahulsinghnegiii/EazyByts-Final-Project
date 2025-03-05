import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  getEventsByDate,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelEventRegistration,
  addEventComment,
  toggleEventLike,
  upload
} from '../controllers/eventController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createEventValidator,
  updateEventValidator,
  commentValidator,
} from '../validators/eventValidators';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);
router.get('/date/:date', getEventsByDate);

// Protected routes - apply auth middleware
router.use(protect);

// Event management routes
router.post('/', 
  protect, // Ensure authentication
  upload.single('image'), // Handle file upload
  validate(createEventValidator), // Validate input
  createEvent // Create event
);

router.put('/:id',
  protect,
  upload.single('image'),
  validate(updateEventValidator),
  updateEvent
);

router.delete('/:id', protect, deleteEvent);

// Event interaction routes
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelEventRegistration);
router.post('/:id/comments', protect, validate(commentValidator), addEventComment);
router.post('/:id/likes', protect, toggleEventLike);

export default router; 