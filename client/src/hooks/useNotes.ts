import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Note, PaginationInfo } from '../types/note';
import { useAuth } from '../context/AuthContext';

export const useNotes = () => {
  const { logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchNotes = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('No authentication token found');
        logout();
        return;
      }

      let url = `http://localhost:5000/api/notes?page=${page}&limit=10&sortBy=updatedAt&sortOrder=desc`;
      
      if (search) {
        url = `http://localhost:5000/api/notes/search?q=${encodeURIComponent(search)}&page=${page}&limit=10&sortBy=updatedAt&sortOrder=desc`;
      }

      console.log('Fetching notes from:', url);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          logout();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success) {
        const notesData = data.data?.notes || data.notes || [];
        const paginationData = data.data?.pagination || data.pagination || pagination;
        
        setNotes(notesData);
        setPagination(paginationData);
        
        console.log('Notes loaded:', notesData.length);
      } else {
        toast.error(data.message || 'Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Error fetching notes. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (newNote: { title: string; content: string; tags: string[] }) => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Title and content are required');
      return false;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newNote.title,
          content: newNote.content,
          tags: newNote.tags
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Note created successfully');
        return true;
      } else {
        toast.error(data.error || 'Failed to create note');
        return false;
      }
    } catch (error) {
      toast.error('Error creating note');
      return false;
    }
  };

  const updateNote = async (noteId: string, updatedNote: { title: string; content: string; tags: string[] }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedNote)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Note updated successfully');
        return true;
      } else {
        toast.error('Failed to update note');
        return false;
      }
    } catch (error) {
      toast.error('Error updating note');
      return false;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Note deleted successfully');
        return true;
      } else {
        toast.error('Failed to delete note');
        return false;
      }
    } catch (error) {
      toast.error('Error deleting note');
      return false;
    }
  };

  const togglePin = async (noteId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${noteId}/pin`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error('Failed to update note');
        return false;
      }
    } catch (error) {
      toast.error('Error updating note');
      return false;
    }
  };

  return {
    notes,
    isLoading,
    pagination,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin
  };
};
