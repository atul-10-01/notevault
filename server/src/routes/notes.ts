import express from 'express';
import { NotesController } from '../controllers/notesController';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  createNoteValidation,
  updateNoteValidation,
  noteIdValidation,
  searchNotesValidation,
  getNotesValidation
} from '../middleware/validation';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/notes - Get all notes for authenticated user
router.get('/', getNotesValidation, NotesController.getNotes);

// GET /api/notes/search - Search notes
router.get('/search', searchNotesValidation, NotesController.searchNotes);

// GET /api/notes/:id - Get specific note by ID
router.get('/:id', noteIdValidation, NotesController.getNoteById);

// POST /api/notes - Create new note
router.post('/', createNoteValidation, NotesController.createNote);

// PUT /api/notes/:id - Update note
router.put('/:id', updateNoteValidation, NotesController.updateNote);

// PATCH /api/notes/:id/pin - Toggle pin status
router.patch('/:id/pin', noteIdValidation, NotesController.togglePin);

// DELETE /api/notes/bulk - Bulk delete notes (must come before DELETE /:id)
router.delete('/bulk', NotesController.bulkDeleteNotes);

// DELETE /api/notes/:id - Delete note
router.delete('/:id', noteIdValidation, NotesController.deleteNote);

export default router;
