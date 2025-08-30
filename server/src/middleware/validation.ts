import { body, query, param, ValidationChain } from 'express-validator';

// Note validation rules
export const createNoteValidation: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags: string[]) => {
      if (tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.trim().length === 0 || tag.trim().length > 30) {
          throw new Error('Each tag must be a non-empty string with maximum 30 characters');
        }
      }
      return true;
    }),
  
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean')
];

export const updateNoteValidation: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid note ID'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags: string[]) => {
      if (tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.trim().length === 0 || tag.trim().length > 30) {
          throw new Error('Each tag must be a non-empty string with maximum 30 characters');
        }
      }
      return true;
    }),
  
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean')
];

export const noteIdValidation: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid note ID')
];

export const searchNotesValidation: ValidationChain[] = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title'])
    .withMessage('Sort by must be one of: createdAt, updatedAt, title'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  query('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean'),
  
  query('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        // Single tag as string
        return true;
      }
      if (Array.isArray(value)) {
        // Multiple tags as array
        return value.every(tag => typeof tag === 'string');
      }
      throw new Error('Tags must be a string or array of strings');
    })
];

export const getNotesValidation: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title'])
    .withMessage('Sort by must be one of: createdAt, updatedAt, title'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  query('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean')
];
