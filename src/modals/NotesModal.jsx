import { useState } from 'react';
import { updateRecordNotes } from '../api/fetchapi.js'; // Import the new API function
import './notesModal.css';

const NotesModal = ({
  setOpenNotesModal,
  initialNotes,
  onNotesUpdated,
  currentCustomerId,
}) => {
  const [notes, setNotes] = useState(initialNotes || '');
  const [noteDate, setNoteDate] =
    useState();
    // new Date().toISOString().slice(0, 10) // Default to today's date in YYYY-MM-DD format

  const handleSave = async () => {
    try {
      const response = await updateRecordNotes(
        currentCustomerId,
        notes,
        noteDate
      ); // Pass noteDate as well
      if (onNotesUpdated) onNotesUpdated();
      setOpenNotesModal(false); // Close the modal after saving
    } catch (error) {
      console.error('Error updating note:', error);
      // Optionally handle or display error
    }
    window.location.reload(); // Reload the entire page
  };

  return (
    <div className='notesModal-bg' onClick={() => setOpenNotesModal(false)}>
      <div
        className='notesModal-container'
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Notes</h2>
        <textarea
          className='notes-data'
          value={notes}
          onChange={(e) => setNotes(e.target.value)} // Update notes state on change
          rows='6' // Set the number of rows for the textarea
        />
        <div className='date-input-container'>
          <label htmlFor='noteDate'>Note Date:</label>
          <input
            type='date'
            id='noteDate'
            value={noteDate}
            onChange={(e) => setNoteDate(e.target.value)} // Update date state on change
          />
        </div>
        <div className='modal-buttons'>
          <button className='save-btn' onClick={handleSave}>
            Save
          </button>
          <button
            className='cancel-btn'
            onClick={() => setOpenNotesModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
