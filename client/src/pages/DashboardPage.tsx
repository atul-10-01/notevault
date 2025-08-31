import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNotes } from '../hooks/useNotes';
import type { Note, NewNote, EditNote } from '../types/note';

// Components
import NoteSidebar from '../components/NoteSidebar';
import NoteContent from '../components/NoteContent';
import MobileNoteView from '../components/MobileNoteView';
import CreateNoteModal from '../components/CreateNoteModal';
import ConfirmationModals from '../components/ConfirmationModals';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { notes, isLoading, pagination, fetchNotes, createNote, updateNote, deleteNote, togglePin, bulkDeleteNotes } = useNotes();
  
  // UI State
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileNoteView, setShowMobileNoteView] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Bulk Selection State
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // Create Note State
  const [newNote, setNewNote] = useState<NewNote>({ title: '', content: '', tags: [] });
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState<EditNote>({ title: '', content: '', tags: [] });
  
  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Effects
  useEffect(() => {
    fetchNotes();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchNotes(1, searchQuery);
      } else {
        fetchNotes(1, '');
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handlers
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  const handleSearch = () => {
    fetchNotes(1, searchQuery.trim());
  };

  const handlePageChange = (page: number) => {
    fetchNotes(page, searchQuery);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setShowMobileNoteView(true);
    setIsEditing(false);
  };

  const handleShowUnsavedWarning = () => {
    setShowUnsavedWarning(true);
  };

  // Create Note Handlers
  const handleCreateNote = async () => {
    const success = await createNote(newNote);
    if (success) {
      setShowCreateModal(false);
      setNewNote({ title: '', content: '', tags: [] });
      fetchNotes(1, searchQuery);
    }
  };

  const handleAddNewNoteTag = (tag: string) => {
    if (tag.trim() && !newNote.tags.includes(tag.trim())) {
      setNewNote({ ...newNote, tags: [...newNote.tags, tag.trim()] });
    }
  };

  const handleRemoveNewNoteTag = (index: number) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter((_, i) => i !== index)
    });
  };

  // Edit Handlers
  const handleStartEditing = () => {
    if (selectedNote) {
      setEditNote({
        title: selectedNote.title,
        content: selectedNote.content,
        tags: selectedNote.tags
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedNote) return;
    
    const success = await updateNote(selectedNote._id, editNote);
    if (success) {
      setIsEditing(false);
      fetchNotes(pagination.currentPage, searchQuery);
    }
  };

  const handleDiscardEdit = () => {
    const hasChanges = 
      editNote.title !== selectedNote?.title ||
      editNote.content !== selectedNote?.content ||
      JSON.stringify(editNote.tags) !== JSON.stringify(selectedNote?.tags);

    if (hasChanges) {
      setShowUnsavedWarning(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleConfirmDiscard = () => {
    setIsEditing(false);
    setShowUnsavedWarning(false);
    if (showMobileNoteView) {
      setShowMobileNoteView(false);
      setSelectedNote(null);
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !editNote.tags.includes(tag.trim())) {
      setEditNote({ ...editNote, tags: [...editNote.tags, tag.trim()] });
    }
  };

  const handleRemoveTag = (index: number) => {
    setEditNote({
      ...editNote,
      tags: editNote.tags.filter((_, i) => i !== index)
    });
  };

  // Delete Handlers
  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;

    const success = await deleteNote(noteToDelete);
    if (success) {
      setSelectedNote(null);
      setShowMobileNoteView(false);
      fetchNotes(pagination.currentPage, searchQuery);
    }
    
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  // Toggle Pin Handler
  const handleTogglePin = async (noteId: string) => {
    const success = await togglePin(noteId);
    if (success) {
      fetchNotes(pagination.currentPage, searchQuery);
    }
  };

  // Close Note Handler
  const handleCloseNote = () => {
    if (isEditing) {
      const hasChanges = 
        editNote.title !== selectedNote?.title ||
        editNote.content !== selectedNote?.content ||
        JSON.stringify(editNote.tags) !== JSON.stringify(selectedNote?.tags);

      if (hasChanges) {
        setShowUnsavedWarning(true);
        return;
      }
    }
    
    setIsEditing(false);
    setShowMobileNoteView(false);
    setSelectedNote(null);
  };

  // Bulk Selection Handlers
  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotes([]);
  };

  const handleToggleNoteSelection = (noteId: string) => {
    setSelectedNotes(prev => {
      const newSelection = prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId];
      
      // Exit selection mode if no notes are selected
      if (newSelection.length === 0) {
        setIsSelectionMode(false);
      }
      
      return newSelection;
    });
  };

  const handleClearSelection = () => {
    setSelectedNotes([]);
    setIsSelectionMode(false);
  };

  const handleBulkDelete = () => {
    if (selectedNotes.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    const success = await bulkDeleteNotes(selectedNotes);
    if (success) {
      setShowBulkDeleteModal(false);
      setSelectedNotes([]);
      setIsSelectionMode(false);
      fetchNotes(pagination.currentPage, searchQuery);
    }
  };

  const handleBulkDeleteCancel = () => {
    setShowBulkDeleteModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Sidebar - Fixed width container */}
        <div className="w-full md:w-96 md:min-w-96 md:max-w-96 lg:w-1/3 lg:min-w-[520px] lg:max-w-[580px] flex-shrink-0">
          <NoteSidebar
            user={user}
            notes={notes}
            selectedNote={selectedNote}
            searchQuery={searchQuery}
            isLoading={isLoading}
            pagination={pagination}
            isEditing={isEditing}
            editNote={editNote}
            isSelectionMode={isSelectionMode}
            selectedNotes={selectedNotes}
            onLogout={handleLogout}
            onCreateNote={() => setShowCreateModal(true)}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            onNoteSelect={handleNoteSelect}
            onTogglePin={handleTogglePin}
            onDeleteNote={handleDeleteNote}
            onPageChange={handlePageChange}
            onShowUnsavedWarning={handleShowUnsavedWarning}
            onToggleSelectionMode={handleToggleSelectionMode}
            onToggleNoteSelection={handleToggleNoteSelection}
            onClearSelection={handleClearSelection}
            onBulkDelete={handleBulkDelete}
          />
        </div>

        {/* Right Content Area - Hidden on mobile */}
        <div 
          className="hidden md:flex flex-1 flex-col min-w-0"
          onClick={() => {
            if (isSelectionMode) {
              setIsSelectionMode(false);
              setSelectedNotes([]);
            }
          }}
        >
          <NoteContent
            selectedNote={selectedNote}
            isEditing={isEditing}
            editNote={editNote}
            onTogglePin={handleTogglePin}
            onStartEditing={handleStartEditing}
            onDeleteNote={handleDeleteNote}
            onSaveEdit={handleSaveEdit}
            onDiscardEdit={handleDiscardEdit}
            onEditNoteChange={setEditNote}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        </div>
      </div>

      {/* Mobile Note View Overlay */}
      <MobileNoteView
        showMobileNoteView={showMobileNoteView}
        selectedNote={selectedNote}
        isEditing={isEditing}
        editNote={editNote}
        onTogglePin={handleTogglePin}
        onStartEditing={handleStartEditing}
        onDeleteNote={handleDeleteNote}
        onCloseNote={handleCloseNote}
        onSaveEdit={handleSaveEdit}
        onDiscardEdit={handleDiscardEdit}
        onEditNoteChange={setEditNote}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />

      {/* Create Note Modal */}
      <CreateNoteModal
        showModal={showCreateModal}
        newNote={newNote}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateNote}
        onNoteChange={setNewNote}
        onAddTag={handleAddNewNoteTag}
        onRemoveTag={handleRemoveNewNoteTag}
      />

      {/* Confirmation Modals */}
      <ConfirmationModals
        showDeleteModal={showDeleteModal}
        showUnsavedWarning={showUnsavedWarning}
        noteToDelete={noteToDelete}
        notes={notes}
        onDeleteCancel={handleDeleteCancel}
        onDeleteConfirm={handleConfirmDelete}
        onUnsavedCancel={() => setShowUnsavedWarning(false)}
        onUnsavedConfirm={handleConfirmDiscard}
      />

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delete Selected Notes</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete {selectedNotes.length} selected note{selectedNotes.length !== 1 ? 's' : ''}? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleBulkDeleteCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
