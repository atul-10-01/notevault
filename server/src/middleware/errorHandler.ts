import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import logger from '../config/logger';

// Standard API response interface
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
  timestamp?: string;
}

// Create standardized API response
export const createResponse = <T>(
  success: boolean,
  message?: string,
  data?: T,
  error?: string,
  details?: any
): APIResponse<T> => {
  const response: APIResponse<T> = {
    success,
    timestamp: new Date().toISOString()
  };

  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  if (error) response.error = error;
  if (details) response.details = details;

  return response;
};

// Custom error class for API errors
export class APIError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// MongoDB duplicate key error handler
const handleDuplicateKeyError = (error: any): APIError => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  return new APIError(
    `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`,
    400,
    true,
    { field, value }
  );
};

// MongoDB validation error handler
const handleValidationError = (error: mongoose.Error.ValidationError): APIError => {
  const errors = Object.values(error.errors).map((err: any) => ({
    field: err.path,
    message: err.message,
    value: err.value
  }));

  return new APIError(
    'Validation failed',
    400,
    true,
    errors
  );
};

// MongoDB cast error handler (invalid ObjectId)
const handleCastError = (error: any): APIError => {
  return new APIError(
    `Invalid ${error.path}: ${error.value}`,
    400,
    true,
    { field: error.path, value: error.value }
  );
};

// JWT error handler
const handleJWTError = (): APIError => {
  return new APIError('Invalid token', 401);
};

const handleJWTExpiredError = (): APIError => {
  return new APIError('Token expired', 401);
};

// Rate limit error handler
const handleRateLimitError = (error: any): APIError => {
  return new APIError(
    'Too many requests',
    429,
    true,
    {
      retryAfter: error.retryAfter,
      limit: error.limit,
      current: error.current
    }
  );
};

// Main error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  logger.error('Error caught by error handler', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).authUser?.userId
  });

  // Handle specific error types
  if (error.code === 11000) {
    error = handleDuplicateKeyError(error);
  }

  if (error.name === 'ValidationError') {
    error = handleValidationError(error);
  }

  if (error.name === 'CastError') {
    error = handleCastError(error);
  }

  if (error.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  if (error.statusCode === 429) {
    error = handleRateLimitError(error);
  }

  // Default to 500 if no status code
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Internal server error';

  // Send error response
  const response = createResponse(
    false,
    undefined,
    undefined,
    message,
    process.env.NODE_ENV === 'development' ? {
      stack: error.stack,
      details: error.details
    } : error.details
  );

  res.status(statusCode).json(response);
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response): void => {
  const message = `Route ${req.originalUrl} not found`;
  
  logger.warn('Route not found', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  const response = createResponse(false, undefined, undefined, message);
  res.status(404).json(response);
};

// Async error wrapper to catch async function errors
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
