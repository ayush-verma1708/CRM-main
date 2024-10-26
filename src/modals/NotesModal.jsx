import { useState } from 'react';
import './notesModal.css';
const NotesModal = ({ setOpenNotesModal, initialNotes, onSave }) => {
  const [notes, setNotes] = useState(initialNotes || '');

  const handleSave = () => {
    onSave(notes); // Call the onSave function with the updated notes
    setOpenNotesModal(false); // Close the modal after saving
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
