import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Note, { INote } from '../models/Note';
import mongoose from 'mongoose';
import { createResponse, APIError, asyncHandler } from '../middleware/errorHandler';
import logger from '../config/logger';

// Helper function to handle validation errors
const handleValidationErrors = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const response = createResponse(false, undefined, undefined, 'Validation failed', errors.array());
    res.status(400).json(response);
    return true;
  }
  return false;
};

// Helper function to check note ownership
const checkNoteOwnership = async (noteId: string, userId: string): Promise<INote | null> => {
  try {
    const note = await Note.findOne({ 
      _id: noteId, 
      userId: new mongoose.Types.ObjectId(userId) 
    });
    return note;
  } catch (error) {
    return null;
  }
};

export class NotesController {
  // Create a new note
  static createNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (handleValidationErrors(req, res)) return;

    const { title, content, tags = [], isPinned = false } = req.body;
    const { userId } = (req as any).authUser;

    logger.info('Creating new note', { userId, title: title.substring(0, 50) });

    const note = new Note({
      title,
      content,
      userId: new mongoose.Types.ObjectId(userId),
      tags,
      isPinned
    });

    await note.save();

    logger.info('Note created successfully', { noteId: note._id, userId });
    
    const response = createResponse(true, 'Note created successfully', note);
    res.status(201).json(response);
  });

  // Get all notes for the authenticated user
  static async getNotes(req: Request, res: Response): Promise<void> {
    try {
      if (handleValidationErrors(req, res)) return;

      const { userId } = (req as any).authUser;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = req.query.sortOrder as string || 'desc';
      const isPinned = req.query.isPinned;

      // Build filter object
      const filter: any = { userId: new mongoose.Types.ObjectId(userId) };
      
      if (isPinned !== undefined) {
        filter.isPinned = isPinned === 'true';
      }

      // Build sort object - Always prioritize pinned notes first
      const sort: any = {};
      
      // Always sort by pinned status first (pinned notes on top)
      sort.isPinned = -1;
      
      // Then sort by the requested field
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const skip = (page - 1) * limit;

      const [notes, totalCount] = await Promise.all([
        Note.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('-__v'),
        Note.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        success: true,
        data: {
          notes,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notes'
      });
    }
  }

  // Get a specific note by ID
  static async getNoteById(req: Request, res: Response): Promise<void> {
    try {
      if (handleValidationErrors(req, res)) return;

      const { id } = req.params;
      const { userId } = (req as any).authUser;

      const note = await checkNoteOwnership(id, userId);

      if (!note) {
        res.status(404).json({
          success: false,
          error: 'Note not found'
        });
        return;
      }

      res.json({
        success: true,
        data: note
      });
    } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch note'
      });
    }
  }

  // Update a note
  static async updateNote(req: Request, res: Response): Promise<void> {
    try {
      if (handleValidationErrors(req, res)) return;

      const { id } = req.params;
      const { userId } = (req as any).authUser;
      const updates = req.body;

      // Check if note exists and belongs to user
      const existingNote = await checkNoteOwnership(id, userId);
      if (!existingNote) {
        res.status(404).json({
          success: false,
          error: 'Note not found'
        });
        return;
      }

      // Update the note
      const updatedNote = await Note.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Note updated successfully',
        data: updatedNote
      });
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update note'
      });
    }
  }

  // Delete a note
  static async deleteNote(req: Request, res: Response): Promise<void> {
    try {
      if (handleValidationErrors(req, res)) return;

      const { id } = req.params;
      const { userId } = (req as any).authUser;

      // Check if note exists and belongs to user
      const note = await checkNoteOwnership(id, userId);
      if (!note) {
        res.status(404).json({
          success: false,
          error: 'Note not found'
        });
        return;
      }

      await Note.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Note deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete note'
      });
    }
  }

  // Toggle pin status of a note
  static async togglePin(req: Request, res: Response): Promise<void> {
    try {
      if (handleValidationErrors(req, res)) return;

      const { id } = req.params;
      const { userId } = (req as any).authUser;

      // Check if note exists and belongs to user
      const note = await checkNoteOwnership(id, userId);
      if (!note) {
        res.status(404).json({
          success: false,
          error: 'Note not found'
        });
        return;
      }

      // Toggle pin status
      const updatedNote = await Note.findByIdAndUpdate(
        id,
        { isPinned: !note.isPinned },
        { new: true }
      );

      res.json({
        success: true,
        message: `Note ${updatedNote?.isPinned ? 'pinned' : 'unpinned'} successfully`,
        data: updatedNote
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle pin status'
      });
    }
  }

  // Search notes
  static async searchNotes(req: Request, res: Response): Promise<void> {
    try {
      if (handleValidationErrors(req, res)) return;

      const { userId } = (req as any).authUser;
      const { q: searchQuery } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = req.query.sortOrder as string || 'desc';
      const isPinned = req.query.isPinned;
      const tags = req.query.tags;

      // Build filter object
      const filter: any = { userId: new mongoose.Types.ObjectId(userId) };

      // Add text search if query provided
      if (searchQuery && typeof searchQuery === 'string') {
        const searchRegex = new RegExp(searchQuery.trim(), 'i'); // Case-insensitive partial match
        filter.$or = [
          { title: { $regex: searchRegex } },
          { content: { $regex: searchRegex } },
          { tags: { $regex: searchRegex } }
        ];
      }

      // Add pinned filter
      if (isPinned !== undefined) {
        filter.isPinned = isPinned === 'true';
      }

      // Add tags filter
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        filter.tags = { $in: tagArray };
      }

      // Build sort object - Always prioritize pinned notes first
      const sort: any = {};
      
      // Always sort by pinned status first (pinned notes on top)
      sort.isPinned = -1;
      
      // Then sort by the requested field
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const skip = (page - 1) * limit;

      // No projection needed for regex search
      const projection = {};

      const [notes, totalCount] = await Promise.all([
        Note.find(filter, projection)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('-__v'),
        Note.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        success: true,
        data: {
          notes,
          searchQuery,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error searching notes:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search notes'
      });
    }
  }

  // Bulk delete notes
  static async bulkDeleteNotes(req: Request, res: Response): Promise<void> {
    try {
      const { noteIds } = req.body;
      const { userId } = (req as any).authUser;

      if (!Array.isArray(noteIds) || noteIds.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Note IDs array is required'
        });
        return;
      }

      // Validate all note IDs
      const validNoteIds = noteIds.filter(id => mongoose.Types.ObjectId.isValid(id));
      if (validNoteIds.length !== noteIds.length) {
        res.status(400).json({
          success: false,
          error: 'Invalid note IDs provided'
        });
        return;
      }

      // Delete notes that belong to the user
      const result = await Note.deleteMany({
        _id: { $in: validNoteIds },
        userId: new mongoose.Types.ObjectId(userId)
      });

      res.json({
        success: true,
        message: `${result.deletedCount} notes deleted successfully`,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      console.error('Error bulk deleting notes:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete notes'
      });
    }
  }
}
