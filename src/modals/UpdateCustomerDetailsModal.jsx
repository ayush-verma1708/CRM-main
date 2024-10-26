import { useState, useEffect } from 'react';
import './updateCustomerDetailsModal.css';
import InputField from '../components/InputField';
import { updateCustomer, fetchRecordById } from '../api/fetchapi'; // Import your update and fetch API functions

const UpdateCustomerDetailsModal = ({
  customerId,
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
    modelPhotographerMUA: '',
    dateOfBirth: '',
    modelStageName: '',
    modelInstaLink: '',
    photographerInstaLink: '',
    muaStageName: '',
    muaInstaLink: '',
  });

  // Fetch customer data when the modal opens
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (customerId) {
        try {
          const customer = await fetchRecordById(customerId);
          setFormData({
            firstName: customer['First Name'] || '',
            lastName: customer['Last Name'] || '',
            phone: customer.Phone || '',
            email: customer.Email || '',
            countryCode: customer['Country Code'] || '',
            address: customer.Address || '',
            state: customer.State || '',
            zipCode: customer['ZIP Code'] || '',
            orderId: customer['Order ID'] || '',
            product: customer.Product || '',
            quantity: customer.Quantity || '',
            discount: customer.Discount || '',
            shipping: customer.Shipping || '',
            amount: customer.Amount || '',
            currency: customer.Currency || '',
            paymentType: customer['Payment Type'] || '',
            paymentMethod: customer['Payment Method'] || '',
            magazine: customer.Magazine || '',
            status: customer.Status || '',
            modelPhotographerMUA: customer["I'm Model/Photographer/MUA"] || '',
            dateOfBirth: customer['Date of Birth'] || '',
            modelStageName: customer['MODEL: Stage Name'] || '',
            modelInstaLink: customer['Model Insta Link 1'] || '',
            photographerInstaLink: customer['Photographer Insta Link 1'] || '',
            muaStageName: customer["MUA's : Stage Name"] || '',
            muaInstaLink: customer['Mua Insta Link-'] || '',
          });
        } catch (error) {
          console.error('Error fetching customer data:', error);
          // Handle error appropriately, e.g., show a notification
        }
      }
    };

    fetchCustomerData();
  }, [customerId]);

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
        'First Name': formData.firstName,
        'Last Name': formData.lastName,
        Phone: formData.phone,
        Email: formData.email,
        'Country Code': formData.countryCode,
        Address: formData.address,
        State: formData.state,
        'ZIP Code': formData.zipCode,
        'Order ID': formData.orderId,
        Product: formData.product,
        Quantity: formData.quantity,
        Discount: formData.discount,
        Shipping: formData.shipping,
        Amount: formData.amount,
        Currency: formData.currency,
        'Payment Type': formData.paymentType,
        'Payment Method': formData.paymentMethod,
        Magazine: formData.magazine,
        Status: formData.status,
        "I'm Model/Photographer/MUA": formData.modelPhotographerMUA,
        'Date of Birth': formData.dateOfBirth,
        'MODEL: Stage Name': formData.modelStageName,
        'Model Insta Link 1': formData.modelInstaLink,
        'Photographer Insta Link 1': formData.photographerInstaLink,
        "MUA's : Stage Name": formData.muaStageName,
        'Mua Insta Link-': formData.muaInstaLink,
      };

      const updatedCustomer = await updateCustomer(customerId, updatedData); // Pass the correct ID
      confirmUpdateDetails(updatedCustomer); // Call the confirmUpdateDetails with updated customer data
      setOpenUpdateDetailsModal(false); // Close modal after updating
    } catch (error) {
      console.error('Error updating customer:', error);
      // Handle error appropriately, e.g., show a notification
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
              label="I'm Model/Photographer/MUA"
              type='text'
              name='modelPhotographerMUA'
              value={formData.modelPhotographerMUA}
              onChange={handleChange}
            />
            <InputField
              label='Date of Birth'
              type='date'
              name='dateOfBirth'
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            <InputField
              label='MODEL: Stage Name'
              type='text'
              name='modelStageName'
              value={formData.modelStageName}
              onChange={handleChange}
            />
            <InputField
              label='Model Insta Link'
              type='text'
              name='modelInstaLink'
              value={formData.modelInstaLink}
              onChange={handleChange}
            />
            <InputField
              label='Photographer Insta Link'
              type='text'
              name='photographerInstaLink'
              value={formData.photographerInstaLink}
              onChange={handleChange}
            />
            <InputField
              label="MUA's Stage Name"
              type='text'
              name='muaStageName'
              value={formData.muaStageName}
              onChange={handleChange}
            />
            <InputField
              label='MUA Insta Link'
              type='text'
              name='muaInstaLink'
              value={formData.muaInstaLink}
              onChange={handleChange}
            />
          </div>
          <button
            className='update-btn'
            type='submit'
            style={{ backgroundColor: '#5932EA' }}
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCustomerDetailsModal;
