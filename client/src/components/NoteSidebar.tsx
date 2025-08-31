import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Pin, Trash2, LogOut, ChevronLeft, ChevronRight, Check, Trash } from 'lucide-react';
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
  isSelectionMode: boolean;
  selectedNotes: string[];
  onLogout: () => void;
  onCreateNote: () => void;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onNoteSelect: (note: Note) => void;
  onTogglePin: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onPageChange: (page: number) => void;
  onShowUnsavedWarning: () => void;
  onToggleSelectionMode: () => void;
  onToggleNoteSelection: (noteId: string) => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
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
  isSelectionMode,
  selectedNotes,
  onLogout,
  onCreateNote,
  onSearchChange,
  onSearch,
  onNoteSelect,
  onTogglePin,
  onDeleteNote,
  onPageChange,
  onShowUnsavedWarning,
  onToggleSelectionMode,
  onToggleNoteSelection,
  onClearSelection,
  onBulkDelete
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
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
         <Link 
           to="/"
           className="flex items-center hover:brightness-125 transition-all duration-200 p-1 rounded-lg"
         >
          <img 
            src="/icon.svg" 
            alt="Highway Delite" 
            className="w-8 mr-6"
          />
          <span className="text-2xl font-bold text-gray-900">Dashboard</span>
        </Link>
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

      {/* Bulk Actions - Only show when items are selected */}
      {isSelectionMode && selectedNotes.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-sm text-blue-700">
                {selectedNotes.length} note{selectedNotes.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => {
                  onClearSelection();
                  onToggleSelectionMode();
                }}
                className="ml-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear
              </button>
            </div>
            <button
              onClick={onBulkDelete}
              className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            {searchQuery && (
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded max-w-60 truncate" title={searchQuery}>
                {searchQuery.length > 25 ? `...${searchQuery.slice(-22)}` : `"${searchQuery}"`}
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
              {notes.map((note) => {
                const isSelected = selectedNotes.includes(note._id);
                let pressTimer: number;

                const handleMouseDown = () => {
                  pressTimer = window.setTimeout(() => {
                    if (!isSelectionMode) {
                      onToggleSelectionMode();
                    }
                    onToggleNoteSelection(note._id);
                  }, 500); // 500ms press and hold
                };

                const handleMouseUp = () => {
                  clearTimeout(pressTimer);
                };

                const handleMouseLeave = () => {
                  clearTimeout(pressTimer);
                };

                const handleContextMenu = (e: React.MouseEvent) => {
                  e.preventDefault();
                  if (!isSelectionMode) {
                    onToggleSelectionMode();
                  }
                  onToggleNoteSelection(note._id);
                };

                const handleClick = () => {
                  if (isSelectionMode) {
                    onToggleNoteSelection(note._id);
                  } else {
                    handleNoteClick(note);
                  }
                };

                return (
                  <div
                    key={note._id}
                    className={`p-3 rounded-lg border transition-colors group cursor-pointer ${
                      selectedNote?._id === note._id && !isSelectionMode
                        ? 'bg-blue-50 border-blue-200'
                        : isSelected
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={handleClick}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onContextMenu={handleContextMenu}
                  >
                    <div className="flex items-start w-full">
                      {/* Selection Indicator - Always reserve space */}
                      <div className="flex items-center mr-3 pt-1 w-6 flex-shrink-0">
                        {isSelectionMode && (
                          <div
                            className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-colors ${
                              isSelected
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center min-w-0">
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
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded truncate max-w-20"
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
                      
                      {/* Action Buttons - Always reserve space */}
                      <div className="flex items-center w-14 flex-shrink-0 justify-end">
                        {!isSelectionMode && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onTogglePin(note._id);
                              }}
                              className={`p-1.5 rounded transition-colors ${
                                note.isPinned
                                  ? 'text-blue-500 hover:bg-blue-100'
                                  : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                              }`}
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteNote(note._id);
                              }}
                              className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-200 space-x-4">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-600 min-w-20 text-center">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteSidebar;
