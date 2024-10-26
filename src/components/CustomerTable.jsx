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

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [openUpdateDetailsModal, setOpenUpdateDetailsModal] = useState(false);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleEye = (id) => {
    const customer = customers.find((customer) => customer.id === id);
    setSelectedNotes(customer.notes);
    setOpenNotesModal(true);
  };

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
              <th>Amount</th>
              <th>Insta Link</th>
              <th>Email</th>
              {/* <th>Lead Source</th> */}
              <th>Notes</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.Name}</td>
                <td>{customer.Magazine}</td>
                <td>{customer.Amount}</td>
                {/* <td>{customer['Instagram Link'] || 'N/A'}</td>{' '} */}
                <td>{customer.Instagram_link}</td> <td>{customer.Email}</td>
                {/* <td>{customer.Lead_source}</td> */}
                <td>{customer.Notes}</td>{' '}
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
          notes={selectedNotes}
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
