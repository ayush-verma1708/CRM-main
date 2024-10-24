import { useState, useEffect } from 'react';
import './updateCustomerDetailsModal.css';
import InputField from '../components/InputField';

const UpdateCustomerDetailsModal = ({ customer, setOpenUpdateDetailsModal, confirmUpdateDetails }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        countryCode: '',
        amount: '',
        notes: ''
    });


    useEffect(() => {
        if (customer) {
            setFormData({
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.phone,
                email: customer.email,
                countryCode: customer.countryCode,
                amount: customer.amount,
                notes: customer.notes
            });
        }
    }, [customer]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        confirmUpdateDetails({
            firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email,
                countryCode: formData.countryCode,
                amount: formData.amount,
                notes: formData.notes
        });
    };

    return (
        <div className='updateCustomerDetailsModal-bg' onClick={() => setOpenUpdateDetailsModal(false)}>
            <div className="updateCustomerDetailsModal-container" onClick={(e) => e.stopPropagation()}>
                <div className='modalTopLine'>
                    <h2 className='custName'>{formData.firstName + " " + formData.lastName || 'Customer'}</h2>
                    <span onClick={() => setOpenUpdateDetailsModal(false)}>
                        <i style={{ backgroundColor: 'white', color: '#5932EA', borderRadius: '50%', cursor: 'pointer' , fontSize:'1.5rem'}} className="fa-regular fa-circle-xmark"></i>
                    </span>
                </div>
                <form className='updateForm' onSubmit={handleSubmit}>
                    <div className='input-labels'>
                        <InputField label="First Name" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                        <InputField label="Last Name" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                        <InputField label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                        <InputField label="E-Mail" type="email" name="email" value={formData.email} onChange={handleChange} />
                        <InputField label="Country Code" type="text" name="countryCode" value={formData.countryCode} onChange={handleChange} />
                        <InputField label="Amount" type="number" name="amount" value={formData.amount} onChange={handleChange} />
                      <InputField label="Notes" type="text" name="notes" value={formData.notes} onChange={handleChange} />
                    </div>
                    <button className='update-btn' type="submit" style={{ backgroundColor: "#5932EA" }}>Update</button>
                </form>
            </div>
        </div>
    )
}

export default UpdateCustomerDetailsModal;
