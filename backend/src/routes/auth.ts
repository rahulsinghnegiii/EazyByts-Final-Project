import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail,
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerValidator,
  loginValidator,
  passwordResetValidator,
  updatePasswordValidator,
} from '../validators/authValidators';

const router = express.Router();

// Public routes
router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', validate(passwordResetValidator), resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.post('/update-password', protect, validate(updatePasswordValidator), updatePassword);

export default router; 