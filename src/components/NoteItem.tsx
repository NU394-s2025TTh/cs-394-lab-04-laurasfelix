// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteItem.tsx
import React, { useState } from 'react';

import { deleteNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteItemProps {
  note: Note;
  onEdit?: (note: Note) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit }) => {
  // TODO: manage state for deleting status and error message
  // TODO: create a function to handle the delete action, which will display a confirmation (window.confirm) and call the deleteNote function from noteService,
  // and update the deleting status and error message accordingly
  const [isDelete, setIsDelete] = useState(false);
  const [error, setError] = useState<Error>();

  const handleDelete = () => {
    if (!window.confirm('This will delete your note.')) {
      return;
    }

    setIsDelete(true);
    deleteNote(note.id).catch((e) => {
      setError(e as Error);
      setIsDelete(false);
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    // Format: "Jan 1, 2023, 3:45 PM"
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  // Calculate time ago for display
  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    let interval = Math.floor(seconds / 31536000); // years
    if (interval >= 1) {
      return `${interval} year${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 2592000); // months
    if (interval >= 1) {
      return `${interval} month${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 86400); // days
    if (interval >= 1) {
      return `${interval} day${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 3600); // hours
    if (interval >= 1) {
      return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 60); // minutes
    if (interval >= 1) {
      return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    }

    return 'just now';
  };
  // TODO: handle edit noteEdit action by calling the onEdit prop with the note object
  // TODO: handle delete note action by calling a deleteNote function from noteService
  // TODO: disable the delete button and edit button while deleting
  // TODO: show error message if there is an error deleting the note
  // TODO: only show the edit button when the onEdit prop is provided

  return (
    <div className="note-item">
      <div className="note-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          {onEdit && (
            <button
              className={`edit-button`}
              disabled={isDelete}
              onClick={() => {
                onEdit?.(note);
              }}
            >
              Edit
            </button>
          )}
          <button
            className={`delete-button`}
            disabled={isDelete}
            onClick={() => handleDelete()}
          >
            {isDelete ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <div className="note-content">{note.content}</div>
      <div className="note-footer">
        <span title={formatDate(note.lastUpdated)}>
          Last updated: {getTimeAgo(note.lastUpdated)}
        </span>
      </div>
      {error && <div className="error-message">{error.message}</div>}
    </div>
  );
};

export default NoteItem;
