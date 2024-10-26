// CustomerDetails.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecordById } from '../api/fetchapi'; // Adjust the path as necessary
import './CustomerDetails.css'; // Import the CSS file for styling

const CustomerDetails = () => {
  const { id } = useParams(); // Get the ID from the URL parameters
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      // Check if the ID is valid (for example, a valid ObjectId or a number)
      if (!id || id.length !== 24) {
        setError('Invalid customer ID');
        setLoading(false);
        return; // Stop further execution if ID is invalid
      }

      try {
        const data = await fetchRecordById(id); // Call the API function
        console.log('Fetched data:', data); // Log the fetched data

        if (!data) {
          setError('No customer found with this ID');
        } else {
          setCustomer(data);
        }
      } catch (err) {
        console.error('Fetch error:', err); // Log the error for debugging

        // Handle error messages based on status code or other properties
        if (err.message.includes('404')) {
          setError('Customer not found');
        } else {
          setError('Error fetching customer details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]); // Dependency array includes id to refetch when it changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const fieldsToDisplay = {
    'First Name': customer['First Name'],
    'Last Name': customer['Last Name'],
    Magazine: customer.Magazine,
    Currency: customer.Currency,
    Amount: customer.Amount,
    Status: customer.Status,
    'Payment Type': customer['Payment Type'],
    'Payment Method': customer['Payment Method'],
    Email: customer.Email,
    Address: customer.Address,
    'ZIP Code': customer['ZIP Code'],
    'Order ID': customer['Order ID'],
    Product: customer.Product,
    Quantity: customer.Quantity,
    Discount: customer.Discount,
    Shipping: customer.Shipping,
  };

  return (
    <div className='customer-details'>
      <h2>Customer Details</h2>
      <div className='details-container'>
        {Object.entries(fieldsToDisplay).map(([key, value]) => (
          <div className='detail-item' key={key}>
            <strong>{key}:</strong> {value !== null ? value.toString() : 'N/A'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDetails;
