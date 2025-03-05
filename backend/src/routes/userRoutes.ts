import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} from '../validators/userValidators';

const router = express.Router();

router.post('/register', validate(registerValidator), registerUser);
router.post('/login', validate(loginValidator), loginUser);
router.get('/profile', protect, getUserProfile);
router.put(
  '/profile',
  protect,
  validate(updateProfileValidator),
  updateUserProfile
);

export default router; 