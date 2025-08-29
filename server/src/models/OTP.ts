import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  purpose: 'email_verification' | 'login';
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  otp: {
    type: String,
    required: true,
    length: 6,
    match: [/^\d{6}$/, 'OTP must be 6 digits']
  },
  purpose: {
    type: String,
    enum: ['email_verification', 'login'],
    required: true,
    default: 'login'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + parseInt(process.env.OTP_EXPIRES_IN || '10') * 60 * 1000)
  },
  attempts: {
    type: Number,
    default: 0,
    max: parseInt(process.env.MAX_OTP_ATTEMPTS || '3')
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for efficient queries
otpSchema.index({ email: 1, purpose: 1 });
otpSchema.index({ email: 1, verified: 1 });

export const OTP = mongoose.model<IOTP>('OTP', otpSchema);
