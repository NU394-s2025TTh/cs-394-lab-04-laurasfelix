// src/components/NoteList.tsx
import React, { useEffect } from 'react';
import { useState } from 'react';

import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}
// TODO: remove the eslint-disable-next-line when you implement the onEditNote handler
const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  const [notes, setNotes] = useState<Notes>({});
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  // TODO: load notes using subscribeToNotes from noteService, use useEffect to manage the subscription; try/catch to handle errors (see lab 3)
  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = subscribeToNotes((fetchedNotes) => {
        setNotes(fetchedNotes);
        setLoading(false);
      });
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }

    return () => unsub();
  }, []);

  if (loading) {
    return <div>Loading notes, hold! </div>;
  }

  if (error) {
    return <div>Error loading notes: {error.message}</div>;
  }

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {Object.values(notes).length === 0 ? (
        <p>No notes yet. Create your first note!</p>
      ) : (
        <div className="notes-container">
          {Object.values(notes)
            // Sort by lastUpdated (most recent first)
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((note) => (
              <NoteItem key={note.id} note={note} onEdit={onEditNote} />
            ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
