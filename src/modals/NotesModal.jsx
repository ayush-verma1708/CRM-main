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

  const handleSave = async () => {
    try {
      const response = await updateRecordNotes(currentCustomerId, notes); // Call the API function
      // findcustomerId(currentCustomerId);

      // Call onNotesUpdated if provided to update the parent component
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
