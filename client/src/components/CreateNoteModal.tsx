import React from 'react';
import { X } from 'lucide-react';
import type { NewNote } from '../types/note';

interface CreateNoteModalProps {
  showModal: boolean;
  newNote: NewNote;
  onClose: () => void;
  onCreate: () => void;
  onNoteChange: (note: NewNote) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  showModal,
  newNote,
  onClose,
  onCreate,
  onNoteChange,
  onAddTag,
  onRemoveTag
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Note</h2>
        </div>
        
        <div className="p-4 lg:p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => onNoteChange({ ...newNote, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter note title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={newNote.content}
              onChange={(e) => onNoteChange({ ...newNote, content: e.target.value })}
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
              {newNote.tags.map((tag, index) => (
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
        </div>
        
        <div className="px-4 lg:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors order-1 sm:order-2"
          >
            Create Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNoteModal;
