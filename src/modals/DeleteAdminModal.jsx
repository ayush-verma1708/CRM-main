import './deleteAdminModal.css';

const DeleteAdminModal = ({ setOpenDeleteModal, confirmDeleteAdmin }) => { 
  return (
    <div className='deleteAdminModal-bg' onClick={() => setOpenDeleteModal(false)}>
      <div className="deleteAdminModal-container" onClick={(e) => e.stopPropagation()}>
        <div className="headingDiv">
          Alert
        </div>

        <p className='modalBody'>Are you sure you want to delete the data?</p>
        <div className="deleteAdminModal-Btns">
          <button onClick={() => setOpenDeleteModal(false)}>Cancel</button>
          <button onClick={confirmDeleteAdmin} style={{ backgroundColor: "#5932EA" }}>Delete</button> 
        </div>
      </div>
    </div>
  )
}

export default DeleteAdminModal;
