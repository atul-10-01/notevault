import React from 'react';
import { Search, Plus, Pin, Trash2, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Note, PaginationInfo } from '../types/note';

interface NoteSidebarProps {
  user: any;
  notes: Note[];
  selectedNote: Note | null;
  searchQuery: string;
  isLoading: boolean;
  pagination: PaginationInfo;
  isEditing: boolean;
  editNote: any;
  onLogout: () => void;
  onCreateNote: () => void;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onNoteSelect: (note: Note) => void;
  onTogglePin: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onPageChange: (page: number) => void;
  onShowUnsavedWarning: () => void;
}

const NoteSidebar: React.FC<NoteSidebarProps> = ({
  user,
  notes,
  selectedNote,
  searchQuery,
  isLoading,
  pagination,
  isEditing,
  editNote,
  onLogout,
  onCreateNote,
  onSearchChange,
  onSearch,
  onNoteSelect,
  onTogglePin,
  onDeleteNote,
  onPageChange,
  onShowUnsavedWarning
}) => {
  const handleNoteClick = (note: Note) => {
    // If currently editing a different note, trigger discard logic
    if (isEditing && selectedNote && selectedNote._id !== note._id) {
      const hasChanges = 
        editNote.title !== selectedNote?.title ||
        editNote.content !== selectedNote?.content ||
        JSON.stringify(editNote.tags) !== JSON.stringify(selectedNote?.tags);

      if (hasChanges) {
        onShowUnsavedWarning();
        return; // Don't switch notes until user decides
      }
    }
    
    onNoteSelect(note);
  };

  return (
    <div className="w-full md:w-2/3 lg:w-3/5 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
         <div className="flex items-center">
          <img 
            src="/icon.svg" 
            alt="Highway Delite" 
            className="w-8 mr-6"
          />
          <span className="text-2xl font-bold text-gray-900">Dashboard</span>
        </div>
          <button
            onClick={onLogout}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline font-semibold">Sign Out</span>
          </button>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h2 className="font-semibold text-gray-900">Welcome, {user?.name}!</h2>
          <p className="text-sm text-gray-600 truncate">{user?.email}</p>
        </div>

        {/* Create Note Button */}
        <button
          onClick={onCreateNote}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Note
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-0 focus:border-blue-500"
          />
          <button
            onClick={onSearch}
            className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors focus:outline-none focus:bg-gray-200"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            {searchQuery && (
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                "{searchQuery}"
              </span>
            )}
          </div>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No notes found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors group ${
                    selectedNote?._id === note._id
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        {note.isPinned && (
                          <Pin className="w-3 h-3 text-blue-500 mr-1 flex-shrink-0" />
                        )}
                        <h4 className="font-medium text-gray-900 truncate">
                          {note.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {note.content.substring(0, 100)}...
                      </p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 2 && (
                            <span className="text-xs text-gray-400">+{note.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePin(note._id);
                        }}
                        className={`p-1.5 rounded transition-colors ${
                          note.isPinned
                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                        }`}
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note._id);
                        }}
                        className="p-1.5 bg-red-100 text-red-500 rounded hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <span className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteSidebar;
