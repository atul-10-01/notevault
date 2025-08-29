# Highway Delite - Note Taking Application

A full-stack note-taking application with secure Email + OTP authentication and Google OAuth integration.

## Tech Stack

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Email + OTP (no passwords) + Google OAuth
- **Email Service**: Nodemailer with Gmail
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS (Mobile-first responsive design)

## Features Implemented

### COMPLETED - Backend Core Setup
- [x] Express server with TypeScript configuration
- [x] MongoDB connection with proper error handling
- [x] Environment configuration with dotenv
- [x] Security middleware (Helmet, CORS)
- [x] Health check endpoints
- [x] Request parsing with size limits (JSON: 10MB, URL-encoded: 10MB)

### COMPLETED - Authentication System
- [x] **Email + OTP Authentication** (Password-less)
- [x] User model with email, name, dateOfBirth, verification status
- [x] OTP model with expiration (10 minutes) and attempt limits (3 tries)
- [x] JWT token generation and verification
- [x] **Rate Limiting**: 30-second cooldown between OTP requests
- [x] Professional email templates (HTML) for OTP delivery
- [x] Welcome email after successful verification
- [x] Email service with Gmail integration

### COMPLETED - Data Models
```typescript
// User Model
{
  email: string,           // Unique identifier
  name: string,            // User's full name
  dateOfBirth: Date,       // Age validation (13-120 years)
  isEmailVerified: boolean,// Email verification status
  lastLogin?: Date,        // Last login timestamp
  createdAt: Date,         // Account creation
  updatedAt: Date          // Last update
}

// OTP Model
{
  email: string,           // Associated email
  otp: string,             // 6-digit code
  purpose: 'email_verification' | 'login',
  expiresAt: Date,         // 10-minute expiration
  attempts: number,        // Max 3 attempts
  verified: boolean        // Verification status
}
```

## Authentication Flow

### Signup Process
1. User provides: **Name** + **Date of Birth** + **Email**
2. Click "Get OTP" → 6-digit code sent to email
3. Enter OTP → Account created and verified
4. Welcome email sent
5. JWT token issued

### Login Process
1. User provides: **Email**
2. Click "Resend OTP" → 6-digit code sent to email
3. Enter OTP → Login successful
4. JWT token issued
5. "Keep me logged in" option available

### Security Features
- COMPLETED: **Rate Limiting**: 30-second cooldown between OTP requests
- COMPLETED: **OTP Expiration**: 10-minute validity
- COMPLETED: **Attempt Limits**: Maximum 3 attempts per OTP
- COMPLETED: **Age Validation**: Users must be 13-120 years old
- COMPLETED: **Email Validation**: Regex pattern validation
- COMPLETED: **Auto Cleanup**: Expired OTPs automatically deleted
- COMPLETED: **Professional Email Templates**: No emojis, clean design

## Project Structure

```
Highway Delite/
├── server/                 # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   │   └── database.ts
│   │   ├── models/         # Mongoose models
│   │   │   ├── User.ts     # User schema
│   │   │   └── OTP.ts      # OTP schema
│   │   ├── services/       # Business logic
│   │   │   ├── emailService.ts    # Gmail integration
│   │   │   ├── jwtService.ts      # Token management
│   │   │   └── otpService.ts      # OTP operations
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth & validation
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                # Environment variables
├── client/                 # Frontend (React + TypeScript)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── README.md              # This file
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- Gmail account with App Password

### Environment Setup
Create `server/.env` file:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/highway-delite

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Gmail Service for OTP
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password

# OTP Configuration
OTP_EXPIRES_IN=10          # Minutes
MAX_OTP_ATTEMPTS=3

# Google OAuth (Future Implementation)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Installation & Run

#### Backend
```bash
cd server
npm install
npm run dev          # Development mode
npm run build        # Production build
npm start            # Production mode
```

#### Frontend
```bash
cd client
npm install
npm run dev          # Development mode
npm run build        # Production build
```

## API Endpoints

### Health Check
- `GET /` - Server health status

### Authentication (Planned for Commit 3)
- `POST /api/auth/signup` - Create account with email + OTP
- `POST /api/auth/verify-otp` - Verify OTP and complete signup/login
- `POST /api/auth/resend-otp` - Resend OTP (30s rate limit)
- `POST /api/auth/login` - Email-based login with OTP
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Notes (Future Implementation)
- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/pin` - Toggle pin status

## Development Roadmap

### COMPLETED (Commits 1-2)
- [x] Basic Express server setup
- [x] MongoDB connection and models
- [x] Email + OTP authentication system
- [x] JWT token management
- [x] Professional email templates
- [x] Rate limiting and security

### CURRENT SPRINT (Commit 3)
- [ ] Authentication API endpoints
- [ ] Input validation middleware
- [ ] Error handling middleware
- [ ] API testing

### UPCOMING FEATURES
- [ ] Notes CRUD API (Commit 4)
- [ ] Google OAuth integration (Commit 5)
- [ ] Frontend authentication UI (Commit 6)
- [ ] Notes management UI (Commit 7)
- [ ] Search and filtering
- [ ] Note pinning/organization
- [ ] Responsive design implementation

## Development Notes

### Rate Limiting Strategy
- **Backend Enforcement**: 30-second cooldown between OTP requests
- **Frontend UX**: Can show shorter countdown (10s) for better user experience
- **Purpose**: Prevents spam while maintaining good UX

### Email Templates
- Clean, professional HTML design
- Responsive layout for mobile devices
- No emojis (professional standard)
- Proper security warnings

### Database Optimization
- Indexes on frequently queried fields
- Automatic cleanup of expired OTPs
- Efficient compound indexes for OTP queries

## Contact & Support

This project is part of a full-stack development assignment showcasing modern web development practices with TypeScript, MongoDB, and secure authentication patterns.

---

**Last Updated**: August 29, 2025  
**Version**: 1.0.0 (Development)  
**Status**: Active Development
