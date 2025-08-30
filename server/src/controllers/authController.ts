import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { OTP } from '../models/OTP';
import { OTPService } from '../services/otpService';
import { JWTService } from '../services/jwtService';
import { GoogleOAuthService } from '../services/googleOAuthService';
import { Types } from 'mongoose';

export class AuthController {
  // POST /api/auth/signup
  static async signup(req: Request, res: Response): Promise<Response> {
    try {
      const { email, name, dateOfBirth } = req.body;

      // Validate required fields
      if (!email || !name || !dateOfBirth) {
        return res.status(400).json({
          success: false,
          error: 'Email, name, and date of birth are required'
        });
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }

      // Validate date of birth format and age
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date of birth format'
        });
      }

      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 13 || age > 120) {
        return res.status(400).json({
          success: false,
          error: 'Age must be between 13 and 120 years'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        if (existingUser.isEmailVerified) {
          return res.status(409).json({
            success: false,
            error: 'User with this email already exists'
          });
        } else {
          // User exists but not verified, allow re-registration
          await User.deleteOne({ email: email.toLowerCase() });
          await OTP.deleteMany({ email: email.toLowerCase() });
        }
      }

      // Create new user (unverified)
      const user = new User({
        email: email.toLowerCase(),
        name: name.trim(),
        dateOfBirth: dob,
        isEmailVerified: false
      });

      await user.save();

      // Generate and send OTP
      const otpResult = await OTPService.createAndSendOTP(email.toLowerCase(), 'email_verification');
      if (!otpResult.success) {
        await User.deleteOne({ email: email.toLowerCase() });
        return res.status(429).json(otpResult);
      }

      return res.status(201).json({
        success: true,
        message: 'User created successfully. OTP sent to your email.',
        data: {
          email: email.toLowerCase(),
          name: name.trim(),
          otpSent: true
        }
      });

    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // POST /api/auth/verify-otp
  static async verifyOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email, otp } = req.body;

      // Validate required fields
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          error: 'Email and OTP are required'
        });
      }

      // Validate OTP format
      if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({
          success: false,
          error: 'OTP must be a 6-digit number'
        });
      }

      // Verify OTP
      const verificationResult = await OTPService.verifyOTP(email.toLowerCase(), otp, 'email_verification');
      if (!verificationResult.success) {
        return res.status(400).json(verificationResult);
      }

      // Update user as verified
      const user = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { isEmailVerified: true },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Generate JWT token
      const token = JWTService.generateToken({ 
        userId: (user._id as Types.ObjectId).toString(), 
        email: user.email 
      });

      return res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        data: {
          user: {
            id: (user._id as Types.ObjectId).toString(),
            email: user.email,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            isEmailVerified: user.isEmailVerified
          },
          token
        }
      });

    } catch (error) {
      console.error('OTP verification error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      // Validate required fields
      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }

      // Check if user exists and is verified
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found. Please sign up first.'
        });
      }

      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          error: 'Email not verified. Please verify your email first.'
        });
      }

      // Generate and send OTP for login
      const otpResult = await OTPService.createAndSendOTP(email.toLowerCase(), 'login');
      if (!otpResult.success) {
        return res.status(429).json(otpResult);
      }

      return res.status(200).json({
        success: true,
        message: 'OTP sent to your email for login verification.',
        data: {
          email: email.toLowerCase(),
          otpSent: true
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // POST /api/auth/verify-login-otp
  static async verifyLoginOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email, otp } = req.body;

      // Validate required fields
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          error: 'Email and OTP are required'
        });
      }

      // Validate OTP format
      if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({
          success: false,
          error: 'OTP must be a 6-digit number'
        });
      }

      // Verify OTP
      const verificationResult = await OTPService.verifyOTP(email.toLowerCase(), otp, 'login');
      if (!verificationResult.success) {
        return res.status(400).json(verificationResult);
      }

      // Get user details
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.isEmailVerified) {
        return res.status(404).json({
          success: false,
          error: 'User not found or not verified'
        });
      }

      // Generate JWT token
      const token = JWTService.generateToken({ 
        userId: (user._id as Types.ObjectId).toString(), 
        email: user.email 
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: (user._id as Types.ObjectId).toString(),
            email: user.email,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            isEmailVerified: user.isEmailVerified
          },
          token
        }
      });

    } catch (error) {
      console.error('Login OTP verification error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // POST /api/auth/resend-otp
  static async resendOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email, purpose } = req.body;

      // Validate required fields
      if (!email || !purpose) {
        return res.status(400).json({
          success: false,
          error: 'Email and purpose are required'
        });
      }

      // Validate purpose
      if (!['email_verification', 'login'].includes(purpose)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid purpose. Must be email_verification or login'
        });
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }

      // Check if user exists
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // For login purpose, user must be verified
      if (purpose === 'login' && !user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          error: 'Email not verified. Please verify your email first.'
        });
      }

      // Generate and send new OTP
      const otpResult = await OTPService.createAndSendOTP(email.toLowerCase(), purpose);
      if (!otpResult.success) {
        return res.status(429).json(otpResult);
      }

      return res.status(200).json({
        success: true,
        message: 'OTP resent successfully',
        data: {
          email: email.toLowerCase(),
          purpose,
          otpSent: true
        }
      });

    } catch (error) {
      console.error('Resend OTP error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // GET /api/auth/me (protected route)
  static async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      // This will be called after JWT middleware validation
      const userId = (req as any).user.userId;

      const user = await User.findById(userId).select('-__v');
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: (user._id as Types.ObjectId).toString(),
            email: user.email,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            isEmailVerified: user.isEmailVerified
          }
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // GET /api/auth/google
  static async googleAuth(req: Request, res: Response): Promise<Response> {
    try {
      const authURL = GoogleOAuthService.generateAuthURL();
      return res.status(200).json({
        success: true,
        message: 'Google OAuth URL generated',
        data: {
          authURL
        }
      });
    } catch (error) {
      console.error('Google auth error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate Google OAuth URL'
      });
    }
  }

  // POST /api/auth/google - Handle Google ID token authentication
  static async googleAuthWithCredential(req: Request, res: Response): Promise<Response> {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({
          success: false,
          error: 'Google credential is required'
        });
      }

      const result = await GoogleOAuthService.verifyIdToken(credential);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error || 'Google authentication failed'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Google authentication successful',
        data: {
          user: result.user,
          token: result.token
        }
      });

    } catch (error) {
      console.error('Google credential auth error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // GET /api/auth/google/callback
  static async googleCallback(req: Request, res: Response): Promise<Response> {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Authorization code is required'
        });
      }

      const result = await GoogleOAuthService.handleCallback(code);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error || 'Google OAuth authentication failed'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Google OAuth authentication successful',
        data: {
          user: result.user,
          token: result.token
        }
      });

    } catch (error) {
      console.error('Google callback error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
