import { useState, useEffect } from 'react';
import './updateCustomerDetailsModal.css';
import InputField from '../components/InputField';
import { updateCustomer, fetchRecordById } from '../api/fetchapi'; // Import your update and fetch API functions

const UpdateCustomerDetailsModal = ({
  CurrentCustomerId,
  setOpenUpdateDetailsModal,
  confirmUpdateDetails,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    countryCode: '',
    address: '',
    state: '',
    zipCode: '',
    orderId: '',
    product: '',
    quantity: '',
    discount: '',
    shipping: '',
    amount: '',
    currency: '',
    paymentType: '',
    paymentMethod: '',
    magazine: '',
    status: '',
    modelType: '', // Updated field name
    stageName: '', // Updated field name
    modelInstaLink: '', // Updated field name
    dateOfBirth: '', // Updated field name
    photographerInstaLink: '', // Updated field name
    muaStageName: '', // Updated field name
    muaInstaLink: '', // Updated field name
    phoneNumber2: '', // New field
    emailAddress2: '', // New field
    country: '', // New field
    notes: '', // New field
    noteDate: '', // New field
  });

  // Fetch customer data when the modal opens
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (CurrentCustomerId) {
        try {
          const customer = await fetchRecordById(CurrentCustomerId);
          setFormData({
            firstName: customer.First_Name || '',
            lastName: customer.Last_Name || '',
            phone: customer.Phone || '',
            email: customer.Email || '',
            countryCode: customer.Country_Code || '',
            address: customer.Address || '',
            state: customer.State || '',
            zipCode: customer.Zip_Code || '',
            orderId: customer.Order_id || '',
            product: customer.Product || '',
            quantity: customer.Quantity || '',
            discount: customer.Discount || '',
            shipping: customer.Shipping || '',
            amount: customer.Amount || '',
            currency: customer.Currency || '',
            paymentType: customer.Payment_Type || '',
            paymentMethod: customer.Payment_Method || '',
            magazine: customer.Magazine || '',
            status: customer.Status || '',
            modelType: customer.Model_Type || '', // Updated field name
            stageName: customer.Stage_Name || '', // Updated field name
            modelInstaLink: customer.Model_Insta_Link || '', // Updated field name
            dateOfBirth: customer.Date_Of_Birth || '', // Updated field name
            photographerInstaLink: customer.Photographer_Insta_Link || '', // Updated field name
            muaStageName: customer.Mua_Stage_Name || '', // Updated field name
            muaInstaLink: customer.Mua_Insta_link || '', // Updated field name
            phoneNumber2: customer.Phone_Number_2 || '', // New field
            emailAddress2: customer.Email_Address_2 || '', // New field
            country: customer.Country || '', // New field
            notes: customer.Notes || '', // New field
            noteDate: customer.NoteDate || '', // New field
          });
        } catch (error) {
          console.error('Error fetching customer data:', error);
          // Handle error appropriately, e.g., show a notification
        }
      }
    };

    fetchCustomerData();
  }, [CurrentCustomerId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        First_Name: formData.firstName,
        Last_Name: formData.lastName,
        Phone: formData.phone,
        Email: formData.email,
        Country_Code: formData.countryCode,
        Address: formData.address,
        State: formData.state,
        Zip_Code: formData.zipCode,
        Order_id: formData.orderId,
        Product: formData.product,
        Quantity: formData.quantity,
        Discount: formData.discount,
        Shipping: formData.shipping,
        Amount: formData.amount,
        Currency: formData.currency,
        Payment_Type: formData.paymentType,
        Payment_Method: formData.paymentMethod,
        Magazine: formData.magazine,
        Status: formData.status,
        Model_Type: formData.modelType, // Updated field name
        Stage_Name: formData.stageName, // Updated field name
        Model_Insta_Link: formData.modelInstaLink, // Updated field name
        Date_Of_Birth: formData.dateOfBirth, // Updated field name
        Photographer_Insta_Link: formData.photographerInstaLink, // Updated field name
        Mua_Stage_Name: formData.muaStageName, // Updated field name
        Mua_Insta_link: formData.muaInstaLink, // Updated field name
        Phone_Number_2: formData.phoneNumber2, // New field
        Email_Address_2: formData.emailAddress2, // New field
        Country: formData.country, // New field
        Notes: formData.notes, // New field
        NoteDate: formData.noteDate, // New field
      };

      const updatedCustomer = await updateCustomer(
        // CurrentCustomerId,
        updatedData
      ); // Pass the correct ID
      confirmUpdateDetails(updatedCustomer); // Call the confirmUpdateDetails with updated customer data
      setOpenUpdateDetailsModal(false); // Close modal after updating
    } catch (error) {
      console.error('Error updating customer:', error);
      // Handle error appropriately, e.g., show a notification
    } finally {
      window.location.reload();
    }
  };

  return (
    <div
      className='updateCustomerDetailsModal-bg'
      onClick={() => setOpenUpdateDetailsModal(false)}
    >
      <div
        className='updateCustomerDetailsModal-container'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='modalTopLine'>
          <h2 className='custName'>
            {formData.firstName + ' ' + formData.lastName || 'Customer'}
          </h2>
          <span onClick={() => setOpenUpdateDetailsModal(false)}>
            <i
              style={{
                backgroundColor: 'white',
                color: '#5932EA',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.5rem',
              }}
              className='fa-regular fa-circle-xmark'
            ></i>
          </span>
        </div>
        <form className='updateForm' onSubmit={handleSubmit}>
          <div className='input-labels'>
            <InputField
              label='First Name'
              type='text'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
            />
            <InputField
              label='Last Name'
              type='text'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
            />
            <InputField
              label='Phone'
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
            />
            <InputField
              label='E-Mail'
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label='Country Code'
              type='text'
              name='countryCode'
              value={formData.countryCode}
              onChange={handleChange}
            />
            <InputField
              label='Address'
              type='text'
              name='address'
              value={formData.address}
              onChange={handleChange}
            />
            <InputField
              label='State'
              type='text'
              name='state'
              value={formData.state}
              onChange={handleChange}
            />
            <InputField
              label='ZIP Code'
              type='text'
              name='zipCode'
              value={formData.zipCode}
              onChange={handleChange}
            />
            <InputField
              label='Order ID'
              type='text'
              name='orderId'
              value={formData.orderId}
              onChange={handleChange}
            />
            <InputField
              label='Product'
              type='text'
              name='product'
              value={formData.product}
              onChange={handleChange}
            />
            <InputField
              label='Quantity'
              type='number'
              name='quantity'
              value={formData.quantity}
              onChange={handleChange}
            />
            <InputField
              label='Discount'
              type='number'
              name='discount'
              value={formData.discount}
              onChange={handleChange}
            />
            <InputField
              label='Shipping'
              type='number'
              name='shipping'
              value={formData.shipping}
              onChange={handleChange}
            />
            <InputField
              label='Amount'
              type='number'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
            />
            <InputField
              label='Currency'
              type='text'
              name='currency'
              value={formData.currency}
              onChange={handleChange}
            />
            <InputField
              label='Payment Type'
              type='text'
              name='paymentType'
              value={formData.paymentType}
              onChange={handleChange}
            />
            <InputField
              label='Payment Method'
              type='text'
              name='paymentMethod'
              value={formData.paymentMethod}
              onChange={handleChange}
            />
            <InputField
              label='Magazine'
              type='text'
              name='magazine'
              value={formData.magazine}
              onChange={handleChange}
            />
            <InputField
              label='Status'
              type='text'
              name='status'
              value={formData.status}
              onChange={handleChange}
            />
            <InputField
              label='Model Type'
              type='text'
              name='modelType'
              value={formData.modelType} // Updated field name
              onChange={handleChange}
            />
            <InputField
              label='Stage Name'
              type='text'
              name='stageName'
              value={formData.stageName} // Updated field name
              onChange={handleChange}
            />
            <InputField
              label='Model Insta Link'
              type='text'
              name='modelInstaLink'
              value={formData.modelInstaLink} // Updated field name
              onChange={handleChange}
            />
            <InputField
              label='Date of Birth'
              type='date'
              name='dateOfBirth'
              value={formData.dateOfBirth} // Updated field name
              onChange={handleChange}
            />
            <InputField
              label='Photographer Insta Link'
              type='text'
              name='photographerInstaLink'
              value={formData.photographerInstaLink} // Updated field name
              onChange={handleChange}
            />
            <InputField
              label='MUA Stage Name'
              type='text'
              name='muaStageName'
              value={formData.muaStageName} // Updated field name
              onChange={handleChange}
            />
            <InputField
              label='MUA Insta Link'
              type='text'
              name='muaInstaLink'
              value={formData.muaInstaLink} // Updated field name
              onChange={handleChange}
            />
            <InputField
              label='Phone Number 2'
              type='tel'
              name='phoneNumber2' // New field
              value={formData.phoneNumber2}
              onChange={handleChange}
            />
            <InputField
              label='Email Address 2'
              type='email'
              name='emailAddress2' // New field
              value={formData.emailAddress2}
              onChange={handleChange}
            />
            <InputField
              label='Country'
              type='text'
              name='country' // New field
              value={formData.country}
              onChange={handleChange}
            />
            <InputField
              label='Notes'
              type='text'
              name='notes' // New field
              value={formData.notes}
              onChange={handleChange}
            />
            <InputField
              label='Note Date'
              type='date'
              name='noteDate' // New field
              value={formData.noteDate}
              onChange={handleChange}
            />
          </div>
          <button type='submit' className='updateBtn'>
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCustomerDetailsModal;
