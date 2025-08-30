import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Authentication routes
router.post('/signup', AuthController.signup);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/login', AuthController.login);
router.post('/verify-login-otp', AuthController.verifyLoginOTP);
router.post('/resend-otp', AuthController.resendOTP);

// Protected routes
router.get('/me', authMiddleware, AuthController.getProfile);

// Google OAuth routes
router.get('/google', AuthController.googleAuth);
router.post('/google', AuthController.googleAuthWithCredential); // New route for ID token
router.get('/google/callback', AuthController.googleCallback);

// Logout route
router.post('/logout', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

export default router;
