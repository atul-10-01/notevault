# Highway Delite - Note Taking Application

A full-stack note-taking application with secure Email + OTP authentication system and modern React frontend.

## Tech Stack

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Email + OTP (no passwords) + Google OAuth (complete)
- **Email Service**: Nodemailer with Gmail
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **OAuth**: Google Auth Library for ID token verification

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Router**: React Router DOM v6
- **State Management**: React Context
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Form Components**: React DatePicker
- **OAuth**: @react-oauth/google for Google authentication

## Features Implemented

### COMPLETED - Frontend Authentication System
- [x] **Complete Authentication UI** with Figma-matching design
- [x] **Signup Page** with inline OTP verification
- [x] **Login Page** with email + OTP flow
- [x] **Google OAuth Integration** with @react-oauth/google
- [x] **Responsive Design** with mobile-first approach
- [x] **Form Validation** with real-time error feedback
- [x] **Authentication Context** with JWT token management
- [x] **Protected Routes** for authenticated access
- [x] **Modern UI Components** with floating labels and animations
- [x] **Professional Icons** with Lucide React integration
- [x] **Notification System** with React Hot Toast
- [x] **Local Storage Integration** for session persistence
- [x] **API Service Layer** with Axios for backend communication
- [x] **TypeScript Types** for enhanced type safety
- [x] **Dashboard Page** with welcome interface

### COMPLETED - Backend Core Setup
- [x] Express server with TypeScript configuration
- [x] MongoDB connection with proper error handling
- [x] Environment configuration with dotenv
- [x] Security middleware (Helmet, CORS)
- [x] Health check endpoints
- [x] Request parsing with size limits (JSON: 10MB, URL-encoded: 10MB)

### COMPLETED - Backend Authentication System
- [x] **Email + OTP Authentication** (Password-less)
- [x] **Google OAuth Integration** (Complete ID token verification)
- [x] User model with email, name, dateOfBirth, verification status
- [x] OTP model with expiration (10 minutes) and attempt limits (3 tries)
- [x] JWT token generation and verification
- [x] **Rate Limiting**: 30-second cooldown between OTP requests
- [x] Professional email templates (HTML) for OTP delivery
- [x] Welcome email after successful verification
- [x] Email service with Gmail integration
- [x] Google OAuth service with ID token verification

### COMPLETED - Backend Notes System
- [x] **Complete CRUD Operations** for user notes
- [x] Note model with title, content, userId, isPinned, tags
- [x] User-specific note ownership and access control
- [x] Pin/unpin functionality for important notes
- [x] Advanced search with MongoDB text indexing
- [x] Filtering by pinned status and tags
- [x] Sorting by date, title, and pinned status
- [x] Pagination support for large note collections
- [x] Bulk delete operations
- [x] Input validation with express-validator
- [x] Comprehensive error handling and user feedback

### COMPLETED - Backend Security & Performance
- [x] **Per-User Rate Limiting**: Individual quotas per authenticated user
- [x] **Input Sanitization**: XSS and NoSQL injection protection
- [x] **Structured Logging**: Winston logger with proper log levels
- [x] **Error Handling**: Comprehensive middleware with standardized responses
- [x] **Security Headers**: Helmet.js for HTTP security headers
- [x] **Request Logging**: Morgan HTTP request logger
- [x] **Data Validation**: Express-validator with custom rules
### COMPLETED - Data Models
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

// Note Model
{
  title: string,           // Note title (1-200 chars)
  content: string,         // Note content (1-10000 chars)
  userId: ObjectId,        // Reference to User
  isPinned: boolean,       // Pin status (default: false)
  tags: string[],          // Optional tags (max 10, 30 chars each)
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last modification
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
1. **Email + OTP Method**:
   - User provides: **Name** + **Date of Birth** + **Email**
   - Click "Get OTP" → 6-digit code sent to email
   - Enter OTP → Account created and verified
   - Welcome email sent
   - JWT token issued

2. **Google OAuth Method**:
   - User clicks "Continue with Google"
   - Google ID token authentication flow
   - Account automatically created/logged in
   - JWT token issued

### Login Process
1. **Email + OTP Method**:
   - User provides: **Email**
   - Click "Get OTP" → 6-digit code sent to email
   - Enter OTP → Login successful
   - JWT token issued
   - "Keep me logged in" option available

2. **Google OAuth Method**:
   - User clicks "Continue with Google"
   - Google ID token verification
   - Automatic login if account exists
   - JWT token issued

### Security Features
- COMPLETED: **Per-User Rate Limiting**: Individual quotas for authenticated users
  - General notes operations: 200 requests per user per 10 minutes
  - Note creation: 50 notes per user per 5 minutes
  - Search operations: 50 searches per user per 5 minutes
  - Individual note operations: 30 requests per user per minute
  - Bulk operations: 20 requests per user per 10 minutes
- COMPLETED: **Input Sanitization**: XSS and NoSQL injection protection
- COMPLETED: **Structured Logging**: Request logging and error tracking
- COMPLETED: **OTP Rate Limiting**: 30-second cooldown between OTP requests
- COMPLETED: **OTP Expiration**: 10-minute validity
- COMPLETED: **Attempt Limits**: Maximum 3 attempts per OTP
- COMPLETED: **Age Validation**: Users must be 13-120 years old
- COMPLETED: **Email Validation**: Regex pattern validation
- COMPLETED: **Auto Cleanup**: Expired OTPs automatically deleted
- COMPLETED: **Professional Email Templates**: No emojis, clean design
- COMPLETED: **HTTP Security Headers**: Helmet.js protection

## Project Structure

```
Highway Delite/
├── server/                 # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   │   └── database.ts
│   │   ├── models/         # Mongoose models
│   │   │   ├── User.ts     # User schema
│   │   │   ├── Note.ts     # Note schema
│   │   │   └── OTP.ts      # OTP schema
│   │   ├── services/       # Business logic
│   │   │   ├── emailService.ts       # Gmail integration
│   │   │   ├── jwtService.ts         # Token management
│   │   │   ├── otpService.ts         # OTP operations
│   │   │   ├── authService.ts        # Authentication logic
│   │   │   └── googleOAuthService.ts # Google OAuth integration
│   │   ├── controllers/    # Route handlers
│   │   │   ├── authController.ts  # Authentication logic
│   │   │   └── notesController.ts # Notes CRUD operations
│   │   ├── middleware/     # Auth, validation & security
│   │   │   ├── auth.ts           # JWT authentication
│   │   │   ├── authMiddleware.ts # Auth middleware
│   │   │   ├── validation.ts     # Input validation rules
│   │   │   ├── rateLimiter.ts    # Per-user rate limiting
│   │   │   ├── sanitization.ts  # XSS & injection protection
│   │   │   └── errorHandler.ts  # Error handling middleware
│   │   ├── config/         # Configuration
│   │   │   ├── database.ts       # Database connection
│   │   │   └── logger.ts         # Winston logging setup
│   │   ├── routes/         # API routes
│   │   │   ├── auth.ts     # Authentication endpoints
│   │   │   └── notes.ts    # Notes API endpoints
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                # Environment variables
├── client/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   │   └── AuthContext.tsx # Authentication state management
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.tsx     # Landing page
│   │   │   ├── SignupPage.tsx   # User registration
│   │   │   ├── LoginPage.tsx    # User login
│   │   │   └── DashboardPage.tsx # User dashboard
│   │   ├── services/       # API services
│   │   │   └── auth.ts     # Authentication API calls
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── auth.ts     # Authentication types
│   │   ├── utils/          # Utility functions
│   │   │   └── validation.ts # Form validation helpers
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── public/             # Static assets
│   │   ├── icon.png        # Application icon
│   │   └── container.svg   # UI illustration
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
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

# Google OAuth (COMPLETED)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Create `client/.env.development` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id
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

### Authentication (COMPLETED)
- `POST /api/auth/signup` - Create account with email + OTP
- `POST /api/auth/verify-otp` - Verify OTP and complete signup/login
- `POST /api/auth/resend-otp` - Resend OTP (30s rate limit)
- `POST /api/auth/login` - Email-based login with OTP
- `POST /api/auth/google` - Google OAuth ID token authentication
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Notes (COMPLETED)
- `GET /api/notes` - Get user notes (with pagination, filtering, sorting)
- `GET /api/notes/search` - Search notes with query parameters
- `GET /api/notes/:id` - Get specific note by ID
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete single note
- `DELETE /api/notes/bulk` - Bulk delete multiple notes
- `PATCH /api/notes/:id/pin` - Toggle pin status

#### Notes API Features
- **Pagination**: `?page=1&limit=10`
- **Sorting**: `?sortBy=createdAt&sortOrder=desc`
- **Filtering**: `?isPinned=true`
- **Search**: `?q=keyword` (searches title and content)
- **Tag Filtering**: `?tags=work,important`
- **Authentication**: All endpoints require JWT token
- **Ownership**: Users can only access their own notes

## Development Roadmap

### COMPLETED (Commits 1-5)
- [x] Basic Express server setup
- [x] MongoDB connection and models
- [x] Email + OTP authentication system
- [x] **Google OAuth integration** (COMPLETED)
- [x] JWT token management
- [x] Professional email templates
- [x] Rate limiting and security
- [x] Authentication API endpoints
- [x] Input validation middleware
- [x] Error handling middleware
- [x] Complete Notes CRUD system
- [x] Advanced search and filtering
- [x] Note pinning and organization
- [x] Bulk operations
- [x] API testing with Postman
- [x] **Security & Performance Enhancements**:
  - [x] Per-user rate limiting system
  - [x] Input sanitization (XSS & NoSQL injection protection)
  - [x] Structured logging with Winston
  - [x] Comprehensive error handling
  - [x] HTTP security headers
  - [x] Request logging and monitoring

### UPCOMING FEATURES
- [ ] Notes management frontend UI
- [ ] Rich text editor for notes
- [ ] File attachments
- [ ] Note sharing capabilities
- [ ] Export functionality
- [ ] Search and filtering UI
- [ ] Mobile app development

## Development Notes

### Rate Limiting Strategy
- **Authentication Endpoints**: IP-based limiting (10 requests per 15 minutes)
- **Notes Operations**: Per-user limiting with different quotas:
  - General operations: 200 requests per 10 minutes per user
  - Note creation: 50 requests per 5 minutes per user
  - Search operations: 50 requests per 5 minutes per user
  - Individual note actions: 30 requests per minute per user
  - Bulk operations: 20 requests per 10 minutes per user
- **Unauthenticated Access**: IP-based limiting (100 requests per 15 minutes)
- **Frontend UX**: Can show shorter countdown (10s) for better user experience
- **Purpose**: Prevents abuse while maintaining good UX

### Security Architecture
- **Input Sanitization**: All user inputs sanitized against XSS and NoSQL injection
- **Error Handling**: Consistent error responses without sensitive information leakage
- **Logging**: Structured logging for monitoring and debugging
- **HTTP Security**: Helmet.js for security headers
- **Authentication**: JWT tokens with proper validation
- **Authorization**: User-specific data access control

### Email Templates
- Clean, professional HTML design
- Responsive layout for mobile devices
- No emojis (professional standard)
- Proper security warnings

### Database Optimization
- Indexes on frequently queried fields
- Automatic cleanup of expired OTPs
- Efficient compound indexes for OTP queries
- MongoDB text indexes for note search functionality
- Optimized queries for user-specific data access

### Security & Performance
- Per-user rate limiting to prevent abuse
- Input sanitization against common attacks
- Structured logging for monitoring
- Comprehensive error handling
- HTTP security headers
- Request/response logging

## Testing

### API Testing
All endpoints have been tested using Postman with the following test cases:
- Authentication flow (signup, OTP verification, login)
- Google OAuth integration and token exchange
- Notes CRUD operations (create, read, update, delete)
- Search functionality with various parameters
- Filtering and sorting capabilities
- Bulk operations
- Error handling and edge cases
- Authorization and access control

### Test Coverage
- Valid input scenarios
- Invalid input validation
- Authentication failures
- Authorization checks
- Rate limiting verification (IP-based and per-user)
- Database constraint validation
- Security middleware testing
- Error handling verification

## Contact & Support

This project is part of a full-stack development assignment showcasing modern web development practices with TypeScript, MongoDB, and secure authentication patterns.

---

**Last Updated**: August 31, 2025  
**Version**: 3.1.0 (Google OAuth Integration Complete)  
**Status**: Complete Authentication System with Google OAuth - Ready for Notes Management UI
