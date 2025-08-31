import React from 'react';
import type { Note } from '../types/note';

interface ConfirmationModalsProps {
  showDeleteModal: boolean;
  showUnsavedWarning: boolean;
  noteToDelete: string | null;
  notes: Note[];
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onUnsavedCancel: () => void;
  onUnsavedConfirm: () => void;
}

const ConfirmationModals: React.FC<ConfirmationModalsProps> = ({
  showDeleteModal,
  showUnsavedWarning,
  noteToDelete,
  notes,
  onDeleteCancel,
  onDeleteConfirm,
  onUnsavedCancel,
  onUnsavedConfirm
}) => {
  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delete Note</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900 text-sm">
                  {notes.find(note => note._id === noteToDelete)?.title}
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={onDeleteCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Unsaved Changes</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                You have unsaved changes. Are you sure you want to discard them?
              </p>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={onUnsavedCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Keep Editing
              </button>
              <button
                onClick={onUnsavedConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModals;
