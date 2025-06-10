// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}
const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  // State for the current note being edited
  const [note, setNote] = useState<Note>(() => {
    return (
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      }
    );
  });
  const [error, setError] = useState<Error>();
  const [isSaving, setIsSaving] = useState(initialNote ? 'Update Note' : 'Save Note');

  useEffect(() => {
    setNote(() => {
      return (
        initialNote || {
          id: uuidv4(),
          title: '',
          content: '',
          lastUpdated: Date.now(),
        }
      );
    });
  }, [initialNote]);

  // TODO: create state for saving status
  // TODO: createState for error handling

  // TODO: Update local state when initialNote changes in a useEffect (if editing an existing note)
  // This effect runs when the component mounts or when initialNote changes
  // It sets the note state to the initialNote if provided, or resets to a new empty note, with a unique ID

  //TODO: on form submit create a "handleSubmit" function that saves the note to Firebase and calls the onSave callback if provided
  // This function should also handle any errors that occur during saving and update the error state accordingly
  const handleSubmit = async () => {
    setIsSaving('Saving...');

    const updatedNote = { ...note, lastUpdated: Date.now() };
    setNote(updatedNote);

    try {
      await saveNote(updatedNote);
      onSave?.(updatedNote);
      setNote(() => {
        return (
          initialNote || {
            id: uuidv4(),
            title: '',
            content: '',
            lastUpdated: Date.now(),
          }
        );
      });
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsSaving(initialNote ? 'Update Note' : 'Save Note');
    }
  };
  // TODO: for each form field; add a change handler that updates the note state with the new value from the form
  // TODO: disable fields and the save button while saving is happening
  // TODO: for the save button, show "Saving..." while saving is happening and "Save Note" when not saving
  // TODO: show an error message if there is an error saving the note
  return (
    <form
      className="note-editor"
      onSubmit={() => {
        handleSubmit();
      }}
    >
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          disabled={isSaving == 'isSaving' ? true : false}
          value={note.title}
          placeholder="Enter note title"
          onChange={(e) => {
            console.log(note);
            setNote((prevNote) => ({
              ...prevNote,
              title: e.target.value,
            }));
          }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          disabled={isSaving == 'isSaving' ? true : false}
          rows={5}
          value={note.content}
          required
          placeholder="Enter note content"
          onChange={(e) => {
            setNote((prevNote) => ({
              ...prevNote,
              content: e.target.value,
            }));
          }}
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={isSaving == 'isSaving' ? true : false}>
          {isSaving}
        </button>
      </div>
      {error && <div className="error-message"> {error.message} </div>}
    </form>
  );
};

export default NoteEditor;
