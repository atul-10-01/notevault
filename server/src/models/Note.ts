import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
  isPinned: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
    maxlength: [200, 'Title must be less than 200 characters'],
    minlength: [1, 'Title cannot be empty']
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
    maxlength: [10000, 'Content must be less than 10000 characters'],
    minlength: [1, 'Content cannot be empty']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true // Index for faster queries
  },
  isPinned: {
    type: Boolean,
    default: false,
    index: true // Index for filtering pinned notes
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags: string[]) {
        return tags.length <= 10; // Max 10 tags
      },
      message: 'Maximum 10 tags allowed'
    }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Compound index for efficient user-specific queries with sorting
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, isPinned: -1, createdAt: -1 });

// Text index for search functionality
noteSchema.index({ 
  title: 'text', 
  content: 'text' 
}, {
  weights: {
    title: 2, // Give title searches more weight
    content: 1
  }
});

// Pre-save middleware to clean and validate tags
noteSchema.pre('save', function(next) {
  if (this.tags) {
    // Clean tags: remove empty strings, trim whitespace, convert to lowercase
    this.tags = this.tags
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0 && tag.length <= 30); // Max 30 chars per tag
    
    // Remove duplicates
    this.tags = [...new Set(this.tags)];
  }
  next();
});

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;
