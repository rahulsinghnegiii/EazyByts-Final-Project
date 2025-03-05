import { body } from 'express-validator';

export const createEventValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be longer than 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot be longer than 2000 characters'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid start date format'),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Invalid end date format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  body('location')
    .optional()
    .isObject()
    .withMessage('Location must be an object'),
  
  body('location.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location name cannot be empty'),

  body('location.address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location address cannot be empty'),

  body('location.coordinates')
    .optional()
    .isObject()
    .withMessage('Coordinates must be an object'),

  body('location.coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),

  body('location.coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('color')
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Invalid color format (use hex format: #RRGGBB)'),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'cancelled', 'postponed', 'completed'])
    .withMessage('Invalid status'),

  body('visibility')
    .optional()
    .isIn(['public', 'private'])
    .withMessage('Invalid visibility'),

  body('capacity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Capacity must be a positive number'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tag cannot be empty'),

  body('recurrence')
    .optional()
    .isObject()
    .withMessage('Recurrence must be an object'),

  body('recurrence.frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Invalid recurrence frequency'),

  body('recurrence.interval')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Recurrence interval must be a positive number'),

  body('recurrence.endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid recurrence end date format'),

  body('recurrence.daysOfWeek')
    .optional()
    .isArray()
    .withMessage('Days of week must be an array'),

  body('recurrence.daysOfWeek.*')
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage('Invalid day of week (0-6)'),

  body('reminders')
    .optional()
    .isArray()
    .withMessage('Reminders must be an array'),

  body('reminders.*.time')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reminder time must be a positive number'),

  body('reminders.*.type')
    .optional()
    .isIn(['email', 'notification'])
    .withMessage('Invalid reminder type'),

  body('registrationEnabled')
    .optional()
    .isBoolean()
    .withMessage('Registration enabled must be a boolean'),

  body('registrationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid registration deadline format')
    .custom((value, { req }) => {
      if (new Date(value) >= new Date(req.body.startDate)) {
        throw new Error('Registration deadline must be before event start date');
      }
      return true;
    }),

  body('waitlistEnabled')
    .optional()
    .isBoolean()
    .withMessage('Waitlist enabled must be a boolean'),
];

export const updateEventValidator = [
  ...createEventValidator,
  body('status')
    .optional()
    .isIn(['draft', 'published', 'cancelled', 'postponed', 'completed'])
    .withMessage('Invalid status'),
];

export const commentValidator = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Comment text is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot be longer than 1000 characters'),
]; 