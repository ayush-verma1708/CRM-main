import { useState, useEffect } from 'react';
import DeleteCustomerModal from '../modals/DeleteCustomerModal';
import UpdateCustomerDetailsModal from '../modals/UpdateCustomerDetailsModal';
import NotesModal from '../modals/NotesModal';
import FilterModal from '../modals/FilterModal';
import {
  fetchRecords,
  updateCustomer,
  deleteCustomer,
  fetchUsers,
} from '../api/fetchapi.js'; // Adjust the path as necessary
import './customerTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [openUpdateDetailsModal, setOpenUpdateDetailsModal] = useState(false);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order
  const [notes, setNotes] = useState(''); // Ensure setNotes is initialized here
  const [records, setRecords] = useState([]);
  const [fields, setFields] = useState([]); // For dynamic fields

  // Price range states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  // Function to fetch records from the server
  const loadRecords = async () => {
    try {
      const data = await fetchRecords(); // Adjust this according to your API
      setRecords(data); // Update records state
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  // Function to fetch users from the API
  const loadUsers = async () => {
    try {
      const userData = await fetchUsers();
      return userData; // Assuming this returns the users
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
      return []; // Return an empty array on error
    }
  };

  // Merge customers and users based on email
  const mergeCustomersWithUsers = (customers, users) => {
    const userMap = {};

    // Fetch customers and users on component mount
    useEffect(() => {
      const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
          const [customerData, userData] = await Promise.all([
            fetchRecords(),
            loadUsers(),
          ]);

          const mergedData = mergeCustomersWithUsers(customerData, userData);
          setCustomers(mergedData);
        } catch (err) {
          setError('Error loading data');
        } finally {
          setLoading(false);
        }
      };

      fetchAllData();
    }, []);

    // Create a map from users for quick lookup
    users.forEach((user) => {
      userMap[user.email] = user; // Adjust this based on your user object structure
    });

    // Merge customers with corresponding users
    return customers.map((customer) => {
      const user = userMap[customer.Email] || {}; // Find the user by email
      return {
        ...customer,
        userFirstName: user.firstName || '', // Assuming user object has firstName
        userLastName: user.lastName || '', // Assuming user object has lastName
        // Add more user fields if necessary
      };
    });
  };

  // Load records on component mount
  useEffect(() => {
    loadRecords();
  }, []);

  const handleNotesUpdated = () => {
    loadRecords(); // Refresh records after note update
  };

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecords(1, 100, search, minPrice, maxPrice);
      const mergedCustomers = mergeCustomersByEmail(data.records); // Merge customers with the same Email Address and Email
      setCustomers(mergedCustomers);

      if (mergedCustomers.length > 0) {
        setFields(Object.keys(mergedCustomers[0]));
      }
    } catch (err) {
      setError('Error fetching customers');
    } finally {
      setLoading(false);
    }
  };

  const mergeCustomersByEmail = (data) => {
    const emailMap = {};

    data.forEach((customer) => {
      const email1 = customer['Email Address'] || '';
      const email2 = customer.Email || '';
      const emailKey = email1 === email2 ? email1 : `${email1}_${email2}`;

      if (emailMap[emailKey]) {
        // If the key already exists, merge values
        const existingCustomer = emailMap[emailKey];

        existingCustomer.Products = existingCustomer.Products
          ? `${existingCustomer.Products}, ${customer.Products}`
          : customer.Products;
        // Concatenate Magazines
        existingCustomer.Magazines = existingCustomer.Magazines
          ? `${existingCustomer.Magazines}, ${customer.Magazine}`
          : customer.Magazine;

        // Example merge logic: customize this as per your requirements
        existingCustomer['Email Address'] = existingCustomer['Email Address']
          ? `${existingCustomer['Email Address']}, ${customer['Email Address']}`
          : customer['Email Address'];

        // Merge Instagram links
        existingCustomer['Model Insta Link 1'] = existingCustomer[
          'Model Insta Link 1'
        ]
          ? `${existingCustomer['Model Insta Link 1']}, ${customer['Model Insta Link 1']}`
          : customer['Model Insta Link 1'];

        existingCustomer['Photographer Insta Link 1'] = existingCustomer[
          'Photographer Insta Link 1'
        ]
          ? `${existingCustomer['Photographer Insta Link 1']}, ${customer['Photographer Insta Link 1']}`
          : customer['Photographer Insta Link 1'];

        existingCustomer['Mua Insta Link'] = existingCustomer['Mua Insta Link']
          ? `${existingCustomer['Mua Insta Link']}, ${customer['Mua Insta Link']}`
          : customer['Mua Insta Link'];

        existingCustomer.Magazine += `, ${customer.Magazine}`;
        existingCustomer.Amount += existingCustomer.Amount + customer.Amount; // Example for Amount
        existingCustomer.Quantity +=
          existingCustomer.Quantity + customer.Quantity; // Example for Amount
        existingCustomer.Notes += ', ' + customer.Notes; // Example for Notes
        existingCustomer.NoteDate = new Date(
          Math.max(
            new Date(existingCustomer.NoteDate),
            new Date(customer.NoteDate)
          )
        ); // Keep the latest date
        // You can merge other fields as needed
      } else {
        // If it doesn't exist, add to the map
        emailMap[emailKey] = { ...customer }; // Use a shallow copy to avoid mutation
      }
    });

    // Convert the map values back to an array
    return Object.values(emailMap);
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, minPrice, maxPrice]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchCustomers();
    }
  };

  // Function to fetch the record notes
  const loadNotes = async () => {
    try {
      console.log('note updated');
      fetchCustomers();
    } catch (error) {
      console.error('Error fetching record:', error);
    }
  };

  // Fetch notes when component mounts or when `currentCustomerId` changes
  useEffect(() => {
    if (currentCustomerId) {
      loadNotes();
    }
  }, [currentCustomerId]);

  useEffect(() => {
    fetchCustomers();
  }, [search, minPrice, maxPrice]); // Add minPrice and maxPrice to the dependency array

  const handleFilter = () => {
    setOpenFilterModal(true);
  };

  const handleDelete = (id) => {
    setOpenDeleteModal(true);
    setCustomerToDelete(id);
  };

  const confirmDeleteCustomer = async () => {
    if (customerToDelete !== null) {
      try {
        await deleteCustomer(customerToDelete);
        setCustomers(
          customers.filter((customer) => customer._id !== customerToDelete)
        );
        setOpenDeleteModal(false);
      } catch (err) {
        setError('Error deleting customer');
      }
    }
  };

  const handleEdit = (id) => {
    const customer = customers.find((customer) => customer._id === id);
    setCurrentCustomer(customer);
    setOpenUpdateDetailsModal(true);
  };
  const handleEye = (id) => {
    const customer = customers.find((customer) => customer._id === id);
    setCurrentCustomerId(id);
    setSelectedNotes(customer.Notes); // Ensure you set the selected notes from the customer object
    setCurrentCustomer(customer);
    setOpenNotesModal(true);
  };

  const confirmUpdateDetails = async (updatedData) => {
    try {
      const updatedCustomer = await updateCustomer(
        currentcustomer._id,
        updatedData
      ); // Call the update API
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === updatedcustomer._id ? updatedCustomer : customer
        )
      );
      setOpenUpdateDetailsModal(false);
    } catch (err) {
      setError('Error updating customer');
    }
  };

  const sortCustomersByAmount = () => {
    const sortedCustomers = [...customers].sort((a, b) => {
      const amountA = parseFloat(a.Amount);
      const amountB = parseFloat(b.Amount);
      return sortOrder === 'asc' ? amountA - amountB : amountB - amountA;
    });
    setCustomers(sortedCustomers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className='customer-table-container'>
      <div className='table-header'>
        <div className='leftHeader'>
          <h3>All Customers</h3>
        </div>
        <div className='rightHeader'>
          <div className='search-customer'>
            <input
              className='search-bar'
              type='text'
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown} // Add this line
            />
            <i className='fa-solid fa-magnifying-glass'></i>
          </div>
          <i
            className='fa-solid fa-filter'
            style={{ fontSize: '1.4rem', color: '#8FA5B1', cursor: 'pointer' }}
            onClick={handleFilter}
          ></i>
        </div>
      </div>
      {/* Price Range Inputs */}
      <div className='price-range-selector'>
        <div className='price-input-group'>
          <label htmlFor='minPrice'>Min Price</label>
          <input
            id='minPrice'
            type='number'
            placeholder='0'
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className='price-input-group'>
          <label htmlFor='maxPrice'>Max Price</label>
          <input
            id='maxPrice'
            type='number'
            placeholder='1000'
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <button onClick={fetchCustomers}>Filter</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className='customer-table'>
            <thead>
              <tr>
                <th>Name</th>
                {/* <th>Magazine</th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={sortCustomersByAmount}
                >
                  Amount
                  {sortOrder === 'asc' ? (
                    <FontAwesomeIcon icon={faSortUp} className='sort-icon' />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} className='sort-icon' />
                  )}
                </th>
                <th>Country Code</th>*/}
                <th>Email</th>
                {/* <th>Order Id</th>  */}
                <th>Insta Link</th>
                {/* <th>Quantity</th>
                <th>Products</th>
                <th>Notes</th>
                <th>Edit Note</th>
                <th>Edit</th>
                <th>Delete</th> */}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    <a href={`/records/${customer._id}`} className='link-cell'>
                      {customer.First_Name} {customer.Last_Name}
                    </a>
                  </td>
                  {/* <td>
                    <a href={`/records/${customer._id}`} className='link-cell'>
                      {customer.Magazine}
                    </a>
                  </td>
                  <td>
                    <a href={`/records/${customer._id}`} className='link-cell'>
                      {customer.Amount}
                    </a>
                  </td>
                  <td>
                    <a href={`/records/${customer._id}`} className='link-cell'>
                      {customer.Country_Code}
                    </a>
                  </td>*/}
                  <td>
                    <a href={`/records/${customer._id}`} className='link-cell'>
                      {customer.Email}
                    </a>
                  </td>
                  {/* <td>
                    <a href={`/records/${customer._id}`} className='link-cell'>
                      {customer.Order_id}
                    </a>
                  </td>  */}
                  <td>
                    <a href={`/records/${customer._id}`} className='link-cell'>
                      {customer.Model_Insta_Link}
                    </a>
                  </td>
                  {/* <td>
                    <a href={`/records/${customer._id}`} className='link-cell'>
                      {customer.Quantity}
                    </a>
                  </td>
                  <td>
                    <a href={`/records/${customer._id}`} className='link-cell'>
                      {customer.Product}
                    </a>
                  </td>

                  <td>
                    <a href={`/records/${customer._id}`} className='link-cell'>
                      {customer.Notes} -{' '}
                      {new Date(customer.NoteDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </a>
                  </td>

                  <td>
                    <button
                      className='notes-btn'
                      onClick={() => handleEye(customer._id)}
                    >
                      <i className='fa-solid fa-eye'></i>
                    </button>
                  </td>
                  <td>
                    <button
                      className='edit-btn'
                      onClick={() => handleEdit(customer._id)}
                    >
                      <i className='fa-solid fa-pencil'></i>
                    </button>
                  </td>
                  <td>
                    <button
                      className='delete-btn'
                      onClick={() => handleDelete(customer._id)}
                    >
                      <i className='fa-solid fa-trash'></i>
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openNotesModal && (
        <NotesModal
          setOpenNotesModal={setOpenNotesModal}
          initialNotes={selectedNotes} // Pass the initial notes to the modal
          onNotesUpdated={handleNotesUpdated}
          // onNotesUpdated={(updatedNotes) => setNotes(updatedNotes)}
          currentCustomerId={currentCustomerId}
        />
      )}

      {openFilterModal && (
        <FilterModal setOpenFilterModal={setOpenFilterModal} />
      )}

      {openDeleteModal && (
        <DeleteCustomerModal
          setOpenDeleteModal={setOpenDeleteModal}
          confirmDeleteCategory={confirmDeleteCustomer}
        />
      )}

      {openUpdateDetailsModal && (
        <UpdateCustomerDetailsModal
          customer={currentCustomer}
          setOpenUpdateDetailsModal={setOpenUpdateDetailsModal}
          confirmUpdateDetails={confirmUpdateDetails}
        />
      )}
    </div>
  );
};

export default CustomerTable;
