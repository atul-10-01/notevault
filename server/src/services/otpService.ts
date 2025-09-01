import crypto from 'crypto';
import { OTP } from '../models/OTP';
import { sendOTPEmail } from './emailService';

export class OTPService {
  // Generate 6-digit OTP
  static generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Check if we can send OTP (rate limiting)
  static async canSendOTP(
    email: string, 
    purpose: 'email_verification' | 'login' = 'login'
  ): Promise<{ canSend: boolean; waitTime?: number; message: string }> {
    try {
      const lastOTP = await OTP.findOne({
        email,
        purpose
      }).sort({ createdAt: -1 });

      if (!lastOTP) {
        return {
          canSend: true,
          message: 'Can send OTP'
        };
      }

      const timeSinceLastOTP = Date.now() - lastOTP.createdAt.getTime();
      const minWaitTime = 10 * 1000; // 10 seconds minimum wait time (relaxed for demo)

      if (timeSinceLastOTP < minWaitTime) {
        const waitTime = Math.ceil((minWaitTime - timeSinceLastOTP) / 1000);
        return {
          canSend: false,
          waitTime,
          message: `Please wait ${waitTime} seconds before requesting another OTP`
        };
      }

      return {
        canSend: true,
        message: 'Can send OTP'
      };
    } catch (error) {
      console.error('Error checking OTP rate limit:', error);
      return {
        canSend: false,
        message: 'Error checking rate limit'
      };
    }
  }

  // Create and send OTP
  static async createAndSendOTP(
    email: string, 
    purpose: 'email_verification' | 'login' = 'login'
  ): Promise<{ success: boolean; message: string; waitTime?: number }> {
    try {
      // Check rate limiting first
      const rateCheck = await this.canSendOTP(email, purpose);
      if (!rateCheck.canSend) {
        return {
          success: false,
          message: rateCheck.message,
          waitTime: rateCheck.waitTime
        };
      }

      // Delete any existing OTPs for this email and purpose
      await OTP.deleteMany({ email, purpose });

      // Generate new OTP
      const otpCode = this.generateOTP();

      // Save OTP to database
      const otp = new OTP({
        email,
        otp: otpCode,
        purpose
      });

      await otp.save();

      // Send OTP via email
      const emailSent = await sendOTPEmail(email, otpCode);

      if (!emailSent) {
        await OTP.deleteOne({ _id: otp._id });
        return {
          success: false,
          message: 'Failed to send OTP email'
        };
      }

      console.log(`OTP sent successfully to ${email}`);
      return {
        success: true,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      console.error('Error creating and sending OTP:', error);
      return {
        success: false,
        message: 'Failed to create OTP'
      };
    }
  }

  // Verify OTP
  static async verifyOTP(
    email: string, 
    otpCode: string, 
    purpose: 'email_verification' | 'login' = 'email_verification'
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Find the OTP
      const otpRecord = await OTP.findOne({
        email,
        purpose,
        verified: false,
        expiresAt: { $gt: new Date() }
      }).sort({ createdAt: -1 }); // Get the latest OTP

      if (!otpRecord) {
        return {
          success: false,
          message: 'Invalid or expired OTP'
        };
      }

      // Check if max attempts exceeded
      const maxAttempts = parseInt(process.env.MAX_OTP_ATTEMPTS || '3');
      if (otpRecord.attempts >= maxAttempts) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return {
          success: false,
          message: 'Maximum OTP attempts exceeded. Please request a new OTP.'
        };
      }

      // Increment attempts
      otpRecord.attempts += 1;

      // Check if OTP matches
      if (otpRecord.otp !== otpCode) {
        await otpRecord.save();
        return {
          success: false,
          message: `Invalid OTP. ${maxAttempts - otpRecord.attempts} attempts remaining.`
        };
      }

      // OTP is correct - mark as verified
      otpRecord.verified = true;
      await otpRecord.save();

      console.log(`OTP verified successfully for ${email}`);
      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP'
      };
    }
  }

  // Clean up expired and verified OTPs
  static async cleanupOTPs(): Promise<void> {
    try {
      const result = await OTP.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          { verified: true }
        ]
      });
      
      if (result.deletedCount > 0) {
        console.log(`Cleaned up ${result.deletedCount} expired/verified OTPs`);
      }
    } catch (error) {
      console.error('Error cleaning up OTPs:', error);
    }
  }
}

export default OTPService;
