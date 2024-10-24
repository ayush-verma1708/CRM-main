import { useState, useEffect } from 'react';
import './accessRole.css';
import Menubar from '../components/Menubar';
import AdminTable from '../components/adminTable'; 
import AddAdminModal from '../modals/AddAdminModal';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase'; 
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const AccessRole = () => {
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const addAdmin = async (adminDetails) => {
    const newAdmin = {
      id: uuidv4(),
      ...adminDetails,
    };
  }

  useEffect(() => {
    const fetchAdmins = async () => {
      const adminPanelCollectionRef = collection(db, 'adminPanel');
      
      setLoading(true);

      const unsubscribe = onSnapshot(adminPanelCollectionRef, (snapshot) => {
        const adminsList = [];

        snapshot.forEach((doc) => {
          const adminData = doc.data().admin;
          if (adminData && Array.isArray(adminData)) {
            adminData.forEach((admin) => {
              const accessRoleData = admin.accessRole;
              let magazines = [];

              if (accessRoleData && Array.isArray(accessRoleData)) {
                accessRoleData.forEach((role) => {
                  if (role.magazine) {
                    magazines.push(role.magazine);
                  }
                });
              }

              const magazineString = magazines.join(', ');

              adminsList.push({
                uid: admin.uid,
                name: admin.name,
                email: admin.email,
                accessRole: magazineString,
              });
            });
          }
        });

        setAdmins(adminsList);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching admins:', error);
        setLoading(false); 
      });

      return () => unsubscribe();
    };

    fetchAdmins();
  }, []);

  if(loading){
    return(
      <div className="spinner"></div>
    )
  }

  return (
    <div className='accessRole-body'>
      <Menubar heading='Access Role' />
      <div className='access-role-content'>
        <AdminTable admins={admins} setAdmins={setAdmins} />
      </div>
      <i className="fa-solid fa-circle-plus addAdminIcon" onClick={() => setIsAddAdminModalOpen(true)}></i>
      {isAddAdminModalOpen && (
        <AddAdminModal setOpenAddAdminModal={setIsAddAdminModalOpen} addAdmin={addAdmin} />
      )}
    </div>
  );
};

export default AccessRole;
