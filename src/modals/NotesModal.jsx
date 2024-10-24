import './notesModal.css'

const NotesModal = ({ setOpenNotesModal, notes }) => {
  return (
    <div className='notesModal-bg' onClick={() => setOpenNotesModal(false)}>
        <div className="notesModal-container" onClick={(e) => e.stopPropagation()}>
          <h2>Notes</h2>
          <p className='notes-data'>{notes}</p>
        
        </div>
    </div>
  )
}

export default NotesModal