import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// IP-based rate limiting for unauthenticated routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
    retryAfter: Math.ceil(15 * 60) // seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiting for authentication endpoints (IP-based)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
    retryAfter: Math.ceil(15 * 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// User-based rate limiting function factory
const createUserBasedLimiter = (windowMs: number, max: number, errorMessage: string) => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req: Request): string => {
      // Use user ID if authenticated
      const authUser = (req as any).authUser;
      if (authUser && authUser.userId) {
        return `user:${authUser.userId}`;
      }
      // For unauthenticated requests (shouldn't happen on protected routes)
      return 'unauthenticated';
    },
    message: {
      success: false,
      error: errorMessage,
      retryAfter: Math.ceil(windowMs / 1000),
      type: 'rate_limit_exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting for failed auth (no user yet)
    skip: (req: Request) => {
      const authUser = (req as any).authUser;
      return !authUser; // Skip if no authenticated user
    }
  });
};

// Rate limiting for general notes operations (per authenticated user)
export const notesLimiter = createUserBasedLimiter(
  10 * 60 * 1000, // 10 minutes
  200, // 200 requests per USER per 10 minutes
  'Too many note operations, please slow down'
);

// Stricter rate limiting for bulk operations (per authenticated user)
export const bulkOperationsLimiter = createUserBasedLimiter(
  10 * 60 * 1000, // 10 minutes
  20, // 20 bulk operations per USER per 10 minutes
  'Too many bulk operations, please wait before trying again'
);

// Rate limiting for search operations (per authenticated user)
export const searchLimiter = createUserBasedLimiter(
  5 * 60 * 1000, // 5 minutes
  50, // 50 search requests per USER per 5 minutes
  'Too many search requests, please slow down'
);

// Rate limiting for individual note operations (per authenticated user)
export const individualNoteLimiter = createUserBasedLimiter(
  1 * 60 * 1000, // 1 minute
  30, // 30 individual note operations per USER per minute
  'Too many requests for individual notes, please slow down'
);

// Special rate limiter for note creation (per authenticated user)
export const createNoteLimiter = createUserBasedLimiter(
  5 * 60 * 1000, // 5 minutes
  50, // 50 note creations per USER per 5 minutes
  'Too many notes created, please slow down'
);
