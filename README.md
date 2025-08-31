# Highway Delite - Complete Note Taking Application

A full-stack note-taking application with secure authentication, comprehensive dashboard, and complete CRUD operations for notes management.

## Tech Stack

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Email + OTP (no passwords) + Google OAuth
- **Email Service**: Nodemailer with Gmail
- **Security**: Helmet, CORS, Rate Limiting, Input Sanitization
- **Validation**: Express Validator
- **OAuth**: Google Auth Library for ID token verification
- **Search**: MongoDB regex-based partial text matching

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with responsive design
- **Icons**: Lucide React
- **Router**: React Router DOM v6
- **State Management**: React Context + Custom Hooks
- **HTTP Client**: Fetch API with custom services
- **Notifications**: React Hot Toast
- **Form Components**: React DatePicker
- **OAuth**: @react-oauth/google for Google authentication
- **Architecture**: Modular component design with separation of concerns

## Features Implemented

### ✅ COMPLETED - Enhanced Navigation & User Experience
- [x] **Smart Logo Navigation** - Context-aware logo behavior across all pages
- [x] **Authentication-Aware Homepage** - Dynamic navigation based on user state
- [x] **Consistent Hover Effects** - Brightness-based interactions for modern feel
- [x] **Clickable Brand Elements** - All logos and icons provide navigation functionality
- [x] **Smooth Scroll Integration** - Homepage logo scrolls to top when clicked
- [x] **Profile Icon Integration** - Authenticated users see profile access instead of auth buttons
- [x] **Cross-Page Navigation** - Seamless movement between homepage, auth pages, and dashboard
- [x] **Visual Feedback Systems** - Consistent hover states and transition effects

### ✅ COMPLETED - Complete Notes Dashboard System
- [x] **Full-Featured Dashboard** with responsive sidebar and content layout
- [x] **Complete CRUD Operations** for notes (Create, Read, Update, Delete)
- [x] **Advanced Search System** with real-time partial text matching
- [x] **Pin/Unpin Functionality** with automatic sorting (pinned notes first)
- [x] **Tags Management** with add/remove functionality in all interfaces
- [x] **Inline Editing** with unsaved changes detection and warnings
- [x] **Mobile-Responsive Design** with overlay-based note viewing
- [x] **Pagination Support** with navigation controls for large note collections
- [x] **Loading States** and comprehensive error handling throughout
- [x] **Custom Confirmation Modals** for delete operations and unsaved changes
- [x] **Real-time UI Updates** with optimistic updates and state synchronization

### ✅ COMPLETED - Modular Frontend Architecture
- [x] **NoteSidebar Component** - User info, search, notes list with actions
- [x] **NoteContent Component** - Main content area with view and edit modes
- [x] **MobileNoteView Component** - Full-screen mobile overlay experience
- [x] **CreateNoteModal Component** - Enhanced note creation with tag management
- [x] **ConfirmationModals Component** - Delete and unsaved warning dialogs
- [x] **useNotes Custom Hook** - Centralized state management for all note operations
- [x] **Modular Component Design** - Reduced main dashboard from 1000+ to 283 lines
- [x] **Reusable UI Components** with consistent styling and behavior
- [x] **TypeScript Types** for enhanced type safety across all components

### ✅ COMPLETED - Frontend Authentication System
- [x] **Complete Authentication UI** with Figma-matching design
- [x] **Signup Page** with inline OTP verification
- [x] **Login Page** with email + OTP flow
- [x] **Google OAuth Integration** with @react-oauth/google
- [x] **Responsive Design** with mobile-first approach
- [x] **Form Validation** with real-time error feedback
- [x] **Authentication Context** with JWT token management
- [x] **Protected Routes** for authenticated access
- [x] **Smart Navigation System** with context-aware logo behavior
- [x] **Authentication-Aware UI** - Dynamic content based on user state
- [x] **Modern UI Components** with floating labels and animations
- [x] **Professional Icons** with Lucide React integration
- [x] **Enhanced Hover Effects** with brightness-based interactions
- [x] **Notification System** with React Hot Toast
- [x] **Local Storage Integration** for session persistence
- [x] **API Service Layer** with custom fetch services for backend communication
- [x] **TypeScript Types** for enhanced type safety

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

### ✅ COMPLETED - Backend Notes System
- [x] **Complete CRUD Operations** for user notes with full validation
- [x] **Advanced Search System** with MongoDB regex-based partial text matching
- [x] **Pin/Unpin Functionality** with automatic sorting (pinned notes always first)
- [x] **Tags Management** with validation and filtering capabilities
- [x] **Intelligent Sorting** - Always prioritizes pinned notes, then applies user-requested sorting
- [x] **Pagination Support** with configurable limits and navigation metadata
- [x] **User-Specific Access Control** - Complete ownership-based security model
- [x] **Bulk Delete Operations** for efficient note management
- [x] **Input Validation** with express-validator and comprehensive error handling
- [x] **Real-time Search** with case-insensitive partial matching across title, content, and tags
- [x] **Filtering Capabilities** by pinned status, tags, and date ranges
- [x] **Optimized Database Queries** with proper indexing and performance considerations

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
│   │   ├── config/         # Database and logging configuration
│   │   │   ├── database.ts
│   │   │   └── logger.ts
│   │   ├── models/         # Mongoose models
│   │   │   ├── User.ts     # User schema with authentication
│   │   │   ├── Note.ts     # Note schema with pinning and tags
│   │   │   └── OTP.ts      # OTP schema with expiration
│   │   ├── services/       # Business logic services
│   │   │   ├── emailService.ts       # Gmail integration
│   │   │   ├── jwtService.ts         # Token management
│   │   │   ├── otpService.ts         # OTP operations
│   │   │   ├── authService.ts        # Authentication logic
│   │   │   └── googleOAuthService.ts # Google OAuth integration
│   │   ├── controllers/    # Route handlers
│   │   │   ├── authController.ts     # Authentication endpoints
│   │   │   └── notesController.ts    # Complete notes CRUD with search
│   │   ├── middleware/     # Security and validation middleware
│   │   │   ├── auth.ts               # JWT authentication
│   │   │   ├── authMiddleware.ts     # Auth middleware
│   │   │   ├── validation.ts         # Input validation rules
│   │   │   ├── rateLimiter.ts        # Per-user rate limiting
│   │   │   ├── sanitization.ts      # XSS & injection protection
│   │   │   └── errorHandler.ts      # Error handling middleware
│   │   ├── routes/         # API routes
│   │   │   ├── auth.ts     # Authentication endpoints
│   │   │   └── notes.ts    # Complete notes API
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                # Environment variables
├── client/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/     # Modular UI components
│   │   │   ├── NoteSidebar.tsx       # Sidebar with search and notes list
│   │   │   ├── NoteContent.tsx       # Main content area with editing
│   │   │   ├── MobileNoteView.tsx    # Mobile overlay experience
│   │   │   ├── CreateNoteModal.tsx   # Note creation modal
│   │   │   └── ConfirmationModals.tsx # Delete and warning modals
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useNotes.ts           # Centralized notes state management
│   │   ├── context/        # React Context providers
│   │   │   └── AuthContext.tsx       # Authentication state management
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.tsx          # Landing page
│   │   │   ├── SignupPage.tsx        # User registration
│   │   │   ├── LoginPage.tsx         # User login
│   │   │   └── DashboardPage.tsx     # Complete notes dashboard
│   │   ├── services/       # API services
│   │   │   └── auth.ts               # Authentication API calls
│   │   ├── types/          # TypeScript type definitions
│   │   │   ├── auth.ts               # Authentication types
│   │   │   └── note.ts               # Note-related types
│   │   ├── utils/          # Utility functions
│   │   │   └── validation.ts         # Form validation helpers
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── public/             # Static assets
│   │   ├── icon.svg        # Application icon
│   │   └── vite.svg        # Vite logo
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

### Notes (✅ COMPLETED)
- `GET /api/notes` - Get user notes with pagination, filtering, and intelligent sorting
- `GET /api/notes/search` - Real-time search with partial text matching across all fields
- `GET /api/notes/:id` - Get specific note by ID with ownership validation
- `POST /api/notes` - Create new note with tags and validation
- `PUT /api/notes/:id` - Update note with comprehensive validation
- `DELETE /api/notes/:id` - Delete single note with ownership checks
- `DELETE /api/notes/bulk` - Bulk delete multiple notes efficiently
- `PATCH /api/notes/:id/pin` - Toggle pin status with automatic sorting

#### Notes API Advanced Features
- **Intelligent Sorting**: Pinned notes always appear first, then user-requested sorting
- **Real-time Search**: Regex-based partial matching in title, content, and tags
- **Pagination**: `?page=1&limit=10` with metadata for navigation
- **Advanced Filtering**: `?isPinned=true&tags=work,important`
- **Multiple Sort Options**: `?sortBy=updatedAt&sortOrder=desc`
- **Performance Optimized**: Efficient database queries with proper indexing
- **Complete Security**: User ownership validation on all operations
- **Error Handling**: Comprehensive validation and user-friendly error messages

## Development Roadmap

### ✅ COMPLETED (Current Version 4.0)
- [x] Complete Express server with TypeScript
- [x] MongoDB connection and optimized schemas
- [x] Email + OTP authentication system
- [x] **Google OAuth integration** 
- [x] JWT token management with security
- [x] Professional email templates
- [x] Comprehensive rate limiting and security
- [x] Complete authentication API endpoints
- [x] Advanced input validation middleware
- [x] Structured error handling middleware
- [x] **Complete Notes CRUD System**
- [x] **Advanced Search with Partial Text Matching**
- [x] **Pin/Unpin with Intelligent Sorting**
- [x] **Tags Management System**
- [x] **Bulk Operations Support**
- [x] **Complete Dashboard UI**
- [x] **Modular Component Architecture**
- [x] **Mobile-Responsive Design**
- [x] **Real-time Search Interface**
- [x] **Inline Editing with Change Detection**
- [x] **Custom Confirmation Modals**
- [x] **Loading States and Error Handling**
- [x] **Security & Performance Enhancements**:
  - [x] Per-user rate limiting system
  - [x] Input sanitization (XSS & NoSQL injection protection)
  - [x] Structured logging with Winston
  - [x] Comprehensive error handling
  - [x] HTTP security headers
  - [x] Request logging and monitoring

### 🚀 POTENTIAL FUTURE ENHANCEMENTS
- [ ] Rich text editor for notes (WYSIWYG)
- [ ] File attachments and media support
- [ ] Note sharing and collaboration
- [ ] Export functionality (PDF, markdown)
- [ ] Advanced search filters and saved searches
- [ ] Note templates and quick actions
- [ ] Offline support with sync
- [ ] Mobile native app development
- [ ] Team workspaces and permissions
- [ ] Integration with external services (Google Drive, Dropbox)

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
All endpoints have been comprehensively tested using Postman with the following test scenarios:
- **Authentication Flow**: Signup, OTP verification, login with all edge cases
- **Google OAuth Integration**: Token exchange and user creation/login
- **Complete Notes CRUD**: Create, read, update, delete with validation testing
- **Advanced Search**: Partial text matching, case sensitivity, special characters
- **Filtering and Sorting**: All combinations of filters and sort orders
- **Pin/Unpin Operations**: Status toggling and automatic sorting verification
- **Bulk Operations**: Multiple note deletion with ownership validation
- **Pagination**: Large dataset navigation and boundary testing
- **Error Handling**: Invalid inputs, unauthorized access, malformed requests
- **Authorization**: Cross-user access prevention and ownership validation
- **Rate Limiting**: IP-based and per-user quota verification
- **Security**: XSS, NoSQL injection, and malformed token testing

### Dashboard Testing
- **Responsive Design**: All breakpoints from mobile (320px) to desktop (1920px+)
- **Component Interaction**: Modal flows, editing states, navigation
- **Real-time Features**: Search debouncing, optimistic updates, error recovery
- **Mobile Experience**: Touch interactions, overlay navigation, gesture support
- **Navigation Testing**: Logo links, authentication-aware routing, smooth scrolling
- **Hover Effects**: Brightness interactions, visual feedback consistency
- **Edge Cases**: Empty states, loading states, network failures
- **Performance**: Large note collections, search responsiveness, memory usage

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
**Version**: 4.0.0 (Complete Notes Dashboard Implementation)  
**Status**: 🎉 **FULLY FUNCTIONAL APPLICATION** - Complete note-taking platform with authentication, dashboard, and all CRUD operations

### 🚀 What's Working Right Now:
- ✅ **Complete User Authentication** (Email/OTP + Google OAuth)
- ✅ **Full Notes Dashboard** with responsive design
- ✅ **Smart Navigation System** with authentication-aware routing
- ✅ **Enhanced User Experience** with consistent hover effects and interactions
- ✅ **Real-time Search** with partial text matching
- ✅ **Complete CRUD Operations** for notes
- ✅ **Pin/Unpin Functionality** with smart sorting
- ✅ **Tags Management** system
- ✅ **Mobile-Responsive Design** with touch-friendly interactions
- ✅ **Inline Editing** with change detection
- ✅ **Confirmation Modals** for user actions
- ✅ **Loading States** and error handling
- ✅ **Secure API** with rate limiting and validation

**Ready for Production Deployment! 🚀**
