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
  const { notes, isLoading, pagination, fetchNotes, createNote, updateNote, deleteNote, togglePin } = useNotes();
  
  // UI State
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileNoteView, setShowMobileNoteView] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Note State
  const [newNote, setNewNote] = useState<NewNote>({ title: '', content: '', tags: [] });
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState<EditNote>({ title: '', content: '', tags: [] });
  
  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

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

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Sidebar */}
        <NoteSidebar
          user={user}
          notes={notes}
          selectedNote={selectedNote}
          searchQuery={searchQuery}
          isLoading={isLoading}
          pagination={pagination}
          isEditing={isEditing}
          editNote={editNote}
          onLogout={handleLogout}
          onCreateNote={() => setShowCreateModal(true)}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onNoteSelect={handleNoteSelect}
          onTogglePin={handleTogglePin}
          onDeleteNote={handleDeleteNote}
          onPageChange={handlePageChange}
          onShowUnsavedWarning={handleShowUnsavedWarning}
        />

        {/* Right Content Area - Hidden on mobile */}
        <div className="hidden md:flex flex-1 flex-col min-w-0">
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
    </>
  );
};

export default DashboardPage;
