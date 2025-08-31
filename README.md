# Highway Delite - Note Taking Application

A full-stack note-taking application built with React, TypeScript, Node.js, and MongoDB. Features secure authentication, note management, and Docker deployment.

## Features

- User Authentication (JWT + Google OAuth)
- Note Management (CRUD operations)
- Search and pagination
- Pin important notes
- Bulk operations
- Responsive design

## Technology Stack

### Frontend
- React 19 with TypeScript
- Vite for development
- Tailwind CSS for styling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- TypeScript

### Infrastructure
- Docker & Docker Compose
- Multi-stage builds
- Volume persistence

## Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running

### Setup
```bash
# Clone and start
git clone <repository-url>
cd highway-delite
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

### Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Fresh start (removes all data)
docker-compose down -v && docker-compose up -d
```

## Manual Installation

### Prerequisites
- Node.js 18+
- MongoDB 7+

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Production Deployment

### Using Deploy Script
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Docker Production
```bash
docker-compose up -d --build
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/highway_delite
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/google` - Google OAuth
- POST `/api/auth/refresh` - Refresh token

### Notes
- GET `/api/notes` - Get all notes
- POST `/api/notes` - Create note
- PUT `/api/notes/:id` - Update note
- DELETE `/api/notes/:id` - Delete note
- PUT `/api/notes/:id/pin` - Toggle pin

## Development

### Backend Development
```bash
cd server
npm run dev        # Start with nodemon
npm run build      # TypeScript build
npm test           # Run tests
```

### Frontend Development
```bash
cd client
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview build
```

## License

MIT License
- **User Authentication**: Secure JWT-based authentication with email/password and Google OAuth
