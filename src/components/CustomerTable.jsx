import { useState, useEffect } from 'react';
import DeleteCustomerModal from '../modals/DeleteCustomerModal';
import UpdateCustomerDetailsModal from '../modals/UpdateCustomerDetailsModal';
import NotesModal from '../modals/NotesModal';
import FilterModal from '../modals/FilterModal';
import { v4 as uuidv4 } from 'uuid';
import {
  fetchRecords,
  createCustomer,
  updateCustomer,
  deleteCustomer,
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
  // Load records on component mount
  useEffect(() => {
    loadRecords();
  }, []);

  const handleNotesUpdated = () => {
    loadRecords(); // Refresh records after note update
  };

  // Fetch customers from the backend API
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecords(1, 100, search); // Adjust pagination and limit as needed
      setCustomers(data.records);
    } catch (err) {
      setError('Error fetching customers');
    } finally {
      setLoading(false);
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
  }, [search]);

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
        await deleteCustomer(customerToDelete); // Call the delete API
        setCustomers(
          customers.filter((customer) => customer.id !== customerToDelete)
        );
        setOpenDeleteModal(false);
      } catch (err) {
        setError('Error deleting customer');
      }
    }
  };

  const handleEdit = (id) => {
    const customer = customers.find((customer) => customer.id === id);
    setCurrentCustomer(customer);
    setOpenUpdateDetailsModal(true);
  };
  const handleEye = (id) => {
    const customer = customers.find((customer) => customer.id === id);
    setCurrentCustomerId(id);
    setSelectedNotes(customer.Notes); // Ensure you set the selected notes from the customer object
    setCurrentCustomer(customer); // Keep track of the current customer for saving later
    setOpenNotesModal(true);
  };

  // Add the onSave function to handle saving notes
  const handleSaveNotes = async (updatedNotes) => {
    console.log('abc');
    // try {
    //   // Call your API to save the updated notes
    //   const updatedCustomer = await updateCustomer(currentCustomer.id, {
    //     Notes: updatedNotes,
    //   });
    //   console.log(updateCustomer);
    //   // Update local state
    //   setCustomers((prevCustomers) =>
    //     prevCustomers.map((customer) =>
    //       customer.id === updatedCustomer.id ? updatedCustomer : customer
    //     )
    //   );
    // } catch (err) {
    //   console.error('Error updating notes:', err);
    //   // Handle error appropriately, e.g., set an error state
    // }
    // fetchCustomers();
  };

  const confirmUpdateDetails = async (updatedData) => {
    try {
      const updatedCustomer = await updateCustomer(
        currentCustomer.id,
        updatedData
      ); // Call the update API
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      );
      setOpenUpdateDetailsModal(false);
    } catch (err) {
      setError('Error updating customer');
    }
  };

  // Function to sort customers by amount
  const sortCustomersByAmount = () => {
    const sortedCustomers = [...customers].sort((a, b) => {
      const amountA = parseFloat(a.Amount); // Ensure Amount is a number
      const amountB = parseFloat(b.Amount);
      return sortOrder === 'asc' ? amountA - amountB : amountB - amountA;
    });
    setCustomers(sortedCustomers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
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

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className='customer-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Magazine</th>
              <th style={{ cursor: 'pointer' }} onClick={sortCustomersByAmount}>
                Amount
                {sortOrder === 'asc' ? (
                  <FontAwesomeIcon icon={faSortUp} className='sort-icon' />
                ) : (
                  <FontAwesomeIcon icon={faSortDown} className='sort-icon' />
                )}
              </th>
              <th>Insta Link</th>
              <th>Email</th>
              <th>Notes</th>
              <th>Edit Note</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <a href={`/records/${customer.id}`} className='link-cell'>
                    {customer.Name}
                  </a>
                </td>
                <td>
                  <a href={`/records/${customer.id}`} className='link-cell'>
                    {customer.Magazine}
                  </a>
                </td>
                <td>
                  <a href={`/records/${customer.id}`} className='link-cell'>
                    {customer.Amount}
                  </a>
                </td>
                <td>
                  <a href={`/records/${customer.id}`} className='link-cell'>
                    {customer.Instagram_link}
                  </a>
                </td>
                <td>
                  <a href={`/records/${customer.id}`} className='link-cell'>
                    {customer.Email}
                  </a>
                </td>
                <td>
                  <a href={`/records/${customer.id}`} className='link-cell'>
                    {customer.Notes}
                  </a>
                </td>
                <td>
                  <button
                    className='notes-btn'
                    onClick={() => handleEye(customer.id)}
                  >
                    <i className='fa-solid fa-eye'></i>
                  </button>
                </td>
                <td>
                  <button
                    className='edit-btn'
                    onClick={() => handleEdit(customer.id)}
                  >
                    <i className='fa-solid fa-pencil'></i>
                  </button>
                </td>
                <td>
                  <button
                    className='delete-btn'
                    onClick={() => handleDelete(customer.id)}
                  >
                    <i className='fa-solid fa-trash'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {openNotesModal && (
        <NotesModal
          setOpenNotesModal={setOpenNotesModal}
          initialNotes={selectedNotes} // Pass the initial notes to the modal
          onSave={handleSaveNotes} // Pass the save function
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
