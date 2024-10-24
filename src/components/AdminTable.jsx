import './adminTable.css';
import DeleteAdminModal from '../modals/DeleteAdminModal';
import { useState } from 'react';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const AdminTable = ({ admins, setAdmins }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const handleDelete = (id) => {
    setOpenDeleteModal(true);
    setAdminToDelete(id);
    console.log(adminToDelete);
  };

  const confirmDeleteAdmin = async () => {
    if (adminToDelete !== null) {
      try {
        const adminDocRef = doc(db, 'adminPanel', adminToDelete);
        await deleteDoc(adminDocRef);

        const newAdmins = admins.filter((admin) => admin.uid !== adminToDelete);
        setAdmins(newAdmins);
        setOpenDeleteModal(false);
      } catch (error) {
        console.error('Error deleting admin from Firestore:', error);
      }
    }
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h3>All Admins</h3>
        <div className='search'>
          <input className="search-bar" type="text" placeholder="Search" />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Admin Name</th>
            <th>Email</th>
            <th>Access Assigned</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.uid}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.accessRole}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(admin.uid)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openDeleteModal && (
        <DeleteAdminModal
          setOpenDeleteModal={setOpenDeleteModal}
          confirmDeleteAdmin={confirmDeleteAdmin} 
        />
      )}
    </div>
  );
};

export default AdminTable;
