import express from 'express';
import { NotesController } from '../controllers/notesController';
import { authMiddleware } from '../middleware/authMiddleware';
import { sanitizeInput, sanitizeNoteData } from '../middleware/sanitization';
import { 
  notesLimiter, 
  bulkOperationsLimiter, 
  searchLimiter, 
  individualNoteLimiter,
  createNoteLimiter 
} from '../middleware/rateLimiter';
import {
  createNoteValidation,
  updateNoteValidation,
  noteIdValidation,
  searchNotesValidation,
  getNotesValidation
} from '../middleware/validation';

const router = express.Router();

// Apply authentication middleware to all routes (must be first)
router.use(authMiddleware);

// Apply input sanitization to all routes
router.use(sanitizeInput);

// GET /api/notes/search - Search notes (before /:id route to avoid conflicts)
router.get('/search', searchLimiter, searchNotesValidation, NotesController.searchNotes);

// GET /api/notes - Get all notes for authenticated user
router.get('/', notesLimiter, getNotesValidation, NotesController.getNotes);

// GET /api/notes/:id - Get specific note by ID
router.get('/:id', individualNoteLimiter, noteIdValidation, NotesController.getNoteById);

// POST /api/notes - Create new note
router.post('/', createNoteLimiter, sanitizeNoteData, createNoteValidation, NotesController.createNote);

// PUT /api/notes/:id - Update note
router.put('/:id', individualNoteLimiter, sanitizeNoteData, updateNoteValidation, NotesController.updateNote);

// PATCH /api/notes/:id/pin - Toggle pin status
router.patch('/:id/pin', individualNoteLimiter, noteIdValidation, NotesController.togglePin);

// DELETE /api/notes/bulk - Bulk delete notes (must come before DELETE /:id)
router.delete('/bulk', bulkOperationsLimiter, NotesController.bulkDeleteNotes);

// DELETE /api/notes/:id - Delete note
router.delete('/:id', individualNoteLimiter, noteIdValidation, NotesController.deleteNote);

export default router;
