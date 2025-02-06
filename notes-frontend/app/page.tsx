"use client";

import { useEffect, useState } from 'react';
import { getNotes, addNote, deleteNote } from '../lib/api';
import ActionSearchBar from '@/components/action-search-bar';
import { DataTable } from '@/components/noteTable/DataTable';

interface Note {
  _id: string;
  title: string;
}

export default function Home() {

  const handleAddNote = async () => {
    if (!title.trim()) return; // Prevent adding empty notes

    try {
      const response = await addNote(title, "Default content"); // Ensure content is passed

      if (!response) {
        throw new Error("Invalid response format");
      }

      setNotes((prevNotes) => [...prevNotes, response]); // Add new note to the list
      setTitle(""); // Clear input field
    } catch (error) {
      console.error("Error adding note:", error);
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
      <DataTable />
      {/* <div className="flex items-center mb-4">
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
      </ul> */}

    </div>
  );
}