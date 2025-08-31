import React from 'react';
import { Plus, Pin, Edit3, Trash2, Save, RotateCcw, X } from 'lucide-react';
import type { Note, EditNote } from '../types/note';

interface NoteContentProps {
  selectedNote: Note | null;
  isEditing: boolean;
  editNote: EditNote;
  onTogglePin: (noteId: string) => void;
  onStartEditing: () => void;
  onDeleteNote: (noteId: string) => void;
  onSaveEdit: () => void;
  onDiscardEdit: () => void;
  onEditNoteChange: (note: EditNote) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
}

const NoteContent: React.FC<NoteContentProps> = ({
  selectedNote,
  isEditing,
  editNote,
  onTogglePin,
  onStartEditing,
  onDeleteNote,
  onSaveEdit,
  onDiscardEdit,
  onEditNoteChange,
  onAddTag,
  onRemoveTag
}) => {
  if (!selectedNote) {
    return (
      <div className="flex-1 flex mt-24 justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No note selected</h3>
          <p className="text-gray-500 text-center">
            Select a note from the sidebar to view its content
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Note Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
              {selectedNote.title}
            </h1>
            {selectedNote.isPinned && (
              <Pin className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 ml-2 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => onTogglePin(selectedNote._id)}
              className={`p-2 rounded-lg transition-colors ${
                selectedNote.isPinned
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={onStartEditing}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteNote(selectedNote._id)}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center mt-2 gap-2 sm:gap-4">
          <span className="text-sm text-gray-500">
            Created: {new Date(selectedNote.createdAt).toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500">
            Updated: {new Date(selectedNote.updatedAt).toLocaleDateString()}
          </span>
        </div>

        {selectedNote.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedNote.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Note Content */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-4 lg:p-6 h-full">
          {isEditing ? (
            <div className="space-y-4 h-full flex flex-col">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editNote.title}
                  onChange={(e) => onEditNoteChange({ ...editNote, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter note title..."
                />
              </div>
              
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={editNote.content}
                  onChange={(e) => onEditNoteChange({ ...editNote, content: e.target.value })}
                  className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Write your note content..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editNote.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => onRemoveTag(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        onAddTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      onAddTag(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={onSaveEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={onDiscardEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none h-full">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed break-words">
                {selectedNote.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NoteContent;
