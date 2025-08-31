import React from 'react';
import { Pin, Edit3, Trash2, Save, RotateCcw, X } from 'lucide-react';
import type { Note, EditNote } from '../types/note';

interface MobileNoteViewProps {
  showMobileNoteView: boolean;
  selectedNote: Note | null;
  isEditing: boolean;
  editNote: EditNote;
  onTogglePin: (noteId: string) => void;
  onStartEditing: () => void;
  onDeleteNote: (noteId: string) => void;
  onCloseNote: () => void;
  onSaveEdit: () => void;
  onDiscardEdit: () => void;
  onEditNoteChange: (note: EditNote) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
}

const MobileNoteView: React.FC<MobileNoteViewProps> = ({
  showMobileNoteView,
  selectedNote,
  isEditing,
  editNote,
  onTogglePin,
  onStartEditing,
  onDeleteNote,
  onCloseNote,
  onSaveEdit,
  onDiscardEdit,
  onEditNoteChange,
  onAddTag,
  onRemoveTag
}) => {
  if (!showMobileNoteView || !selectedNote) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
      {/* Mobile Note Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-4">
          {selectedNote.title}
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onTogglePin(selectedNote._id)}
            className={`p-2 rounded-lg transition-colors ${
              selectedNote.isPinned
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            <Pin className="w-4 h-4" />
          </button>
          <button
            onClick={onStartEditing}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteNote(selectedNote._id)}
            className="p-2 bg-red-100 text-red-600 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onCloseNote}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Note Content */}
      <div className="flex-1 bg-white p-4 overflow-y-auto">
        {isEditing ? (
          <div className="space-y-4">
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={editNote.content}
                onChange={(e) => onEditNoteChange({ ...editNote, content: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                Save
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
          <>
            <div className="mb-4">
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <span>Created: {new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(selectedNote.updatedAt).toLocaleDateString()}</span>
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
            
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed break-words">
                {selectedNote.content}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNoteView;
