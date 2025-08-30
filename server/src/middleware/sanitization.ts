import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

// Configure XSS options
const xssOptions = {
  whiteList: {}, // Allow no HTML tags
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'],
};

// Safe sanitization middleware that doesn't modify read-only properties
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only sanitize request body (which is safe to modify)
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    // Log potential NoSQL injection patterns without modifying the request
    if (req.query) {
      checkForInjectionPatterns(req.query, 'query', req.ip);
    }
    if (req.params) {
      checkForInjectionPatterns(req.params, 'params', req.ip);
    }

    next();
  } catch (error) {
    console.error('Sanitization error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid input data format'
    });
  }
};

// Check for NoSQL injection patterns without modifying the object
function checkForInjectionPatterns(obj: any, source: string, ip?: string) {
  if (!obj || typeof obj !== 'object') return;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && (value.includes('$') || value.includes('{'))) {
      console.warn(`Potential NoSQL injection pattern detected in ${source}: ${key} from IP: ${ip}`);
    }
  }
}

// Recursively sanitize object properties
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitize the key itself
      const cleanKey = typeof key === 'string' ? xss(key, xssOptions) : key;
      sanitized[cleanKey] = sanitizeObject(value);
    }
    return sanitized;
  }

  if (typeof obj === 'string') {
    // Remove potential XSS attacks
    return xss(obj, xssOptions);
  }

  return obj;
}

// Additional sanitization for note content (allows some formatting)
export const sanitizeNoteContent = (content: string): string => {
  const noteXssOptions = {
    whiteList: {
      // Allow basic formatting tags for notes
      'b': [],
      'i': [],
      'u': [],
      'strong': [],
      'em': [],
      'br': [],
      'p': [],
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  };

  return xss(content, noteXssOptions);
};

// Validate and sanitize specific note fields
export const sanitizeNoteData = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.title && typeof req.body.title === 'string') {
      req.body.title = xss(req.body.title, xssOptions);
    }

    if (req.body.content && typeof req.body.content === 'string') {
      req.body.content = sanitizeNoteContent(req.body.content);
    }

    if (req.body.tags && Array.isArray(req.body.tags)) {
      req.body.tags = req.body.tags.map((tag: any) => 
        typeof tag === 'string' ? xss(tag, xssOptions) : tag
      );
    }

    next();
  } catch (error) {
    console.error('Note sanitization error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid note data format'
    });
  }
};
