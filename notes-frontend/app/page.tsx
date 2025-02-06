import { useEffect, useState } from 'react';
import { getNotes, addNote, deleteNote } from '../lib/api';

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
      setNotes((prevNotes) => [...prevNotes, newNote]); // Update state directly
      setTitle('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter(note => note._id !== id)); // Update state directly
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="container">
      <h1>Notes</h1>
      <div className="input-container">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a note"
        />
        <button onClick={handleAddNote}>Add</button>
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            {note.title}
            <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}