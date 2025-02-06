"use client";

import { useEffect, useState } from 'react';
import { getNotes, addNote, deleteNote } from '../lib/api';
import ActionSearchBar from '@/components/action-search-bar';

interface Note {
  _id: string;
  title: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddNote = async () => {
    if (!title.trim()) return;

    try {
      const response = await addNote({ title });
      const newNote = response.data;
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setTitle('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Notes</h1>
      <ActionSearchBar />
      <div className="flex items-center mb-4">
        <input
          className="border border-gray-300 rounded p-2 flex-grow mr-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a note"
        />
        <button
          className="bg-blue-500 text-white rounded p-2"
          onClick={handleAddNote}
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li
            key={note._id}
            className="flex items-center justify-between border-b border-gray-300 p-2"
          >
            <span>{note.title}</span>
            <button
              className="bg-red-500 text-white rounded p-1"
              onClick={() => handleDeleteNote(note._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}