import { useState } from 'react';
import './addAdminModal.css';
import InputField from '../components/InputField';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AddAdminModal = ({ setOpenAddAdminModal, addAdmin }) => {
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    password: '',
    accessAssigned: ''
  });

  const accessAssignedOptions = ['Alphero', 'Blackcruze', 'Blaze', 'Con', 'Envy', 'Mac', 'Magblack', 'Mirror', 'Uncover', 'Will'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const adminData = {
        name: formData.name,
        email: formData.email,
        accessAssigned: formData.accessAssigned,
        uid: user.uid, 
      };

      await setDoc(doc(db, "adminPanel", user.uid), {
        admin: [
          {
            accessRole: [
              {
                magazine: formData.accessAssigned,
              }
            ],
            email: formData.email,
            name: formData.name,
            uid: user.uid
          }
        ]
      });

      addAdmin(adminData);

      setOpenAddAdminModal(false);

      alert("Admin created successfully!");
    } catch (error) {
      console.error("Error creating admin: ", error);
      alert("Error creating admin: " + error.message);
    }
  };

  return (
    <div className='addAdminModal-bg' onClick={() => setOpenAddAdminModal(false)}>
      <div className="addAdminModal-container" onClick={(e) => e.stopPropagation()}>
        <div className='modalTopLine'>
          <h2 className='AdminName'>Add Admin</h2>
          <span onClick={() => setOpenAddAdminModal(false)}>
            <i style={{ backgroundColor: 'white', color: '#5932EA', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem' }} className="fa-regular fa-circle-xmark"></i>
          </span>
        </div>
        <form className='addAdminForm' onSubmit={handleSubmit}>
          <div className='input-labels'>
            <InputField label="Admin Name" type="text" name="name" value={formData.name} onChange={handleChange} /> 
            <InputField label="E-Mail" type="email" name="email" value={formData.email} onChange={handleChange} />
            <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />

            {/* Dropdown for Access Assigned */}
            <label className='dropdown-label'>
              Access Assigned
              <select name="accessAssigned" value={formData.accessAssigned} onChange={handleChange}>
                <option value="">Select Access Assigned</option>
                {accessAssignedOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <button className='add-btn' type="submit" style={{ backgroundColor: "#5932EA" }}>Add</button>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
