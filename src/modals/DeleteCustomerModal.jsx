import './deleteCustomerModal.css'

const DeleteCustomerModal = ({ setOpenDeleteModal, confirmDeleteCategory }) => {
  return (
    <div className='deleteCustomerModal-bg' onClick={() => setOpenDeleteModal(false)}>
        <div className="deleteCustomerModal-container" onClick={(e) => e.stopPropagation()}>
            <div className="headingDiv">
                Alert
            </div>

            <p className='modalBody'>Are you sure you want to delete the data?</p>
            <div className="deleteCustomerModal-Btns">
                <button onClick={() => setOpenDeleteModal(false)}>Cancel</button>
                <button onClick={confirmDeleteCategory} style={{backgroundColor: "#5932EA"}}>Delete</button>
            </div>
        
        </div>
    </div>
  )
}

export default DeleteCustomerModal