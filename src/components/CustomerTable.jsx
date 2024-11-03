import { useState, useEffect } from 'react';
import DeleteCustomerModal from '../modals/DeleteCustomerModal';
import UpdateCustomerDetailsModal from '../modals/UpdateCustomerDetailsModal';
import NotesModal from '../modals/NotesModal';
import FilterModal from '../modals/FilterModal';
import {
  fetchRecords,
  updateCustomer,
  deleteCustomer,
} from '../api/fetchapi.js'; // Adjust the path as necessary
import './customerTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

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

  const [tableFields, setTableFields] = useState({
    Name: true,
    Magazine: true,
    Amount: true,
    Country_Code: false,
    Email: true,
    Order_id: true,
    Address: false,
    Product: false,
    Quantity: false,
    Model_Insta_Link: true,
    Note: true,
  });

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
    window.localStorage.removeItem('currCustId');
  }, []);

  const handleNotesUpdated = () => {
    loadRecords(); // Refresh records after note update
  };

  // Updated fetchCustomers function
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
      // Create a unique key based on both Email Address and Email
      // const emailKey = `${customer.Email}_${customer.Email}`;
      // Create a unique key based on both Email Address and Email fields
      const email1 = customer.Email || '';
      const email2 = customer.Email || '';
      const emailKey = email1 === email2 ? email1 : `${email1}_${email2}`;

      if (emailMap[emailKey]) {
        // If the key already exists, merge values
        const existingCustomer = emailMap[emailKey];

        // Concatenate each product on a new line or with a bullet point
        existingCustomer.Product = existingCustomer.Product
          ? `${existingCustomer.Product}\n- ${customer.Product}` // Bullet point style
          : `- ${customer.Product}`; // Initialize with bullet for the first entry

        // Concatenate Magazines
        // existingCustomer.Magazines = existingCustomer.Magazines
        //   ? `${existingCustomer.Magazines}, ${customer.Magazine}`
        //   : customer.Magazine;

        existingCustomer.Magazine += `, ${customer.Magazine}`;
        // existingCustomer.Amount += existingCustomer.Amount + customer.Amount; // Example for Amount
        existingCustomer.Amount = Math.round(
          existingCustomer.Amount + customer.Amount
        );

        // existingCustomer.Quantity +=
        //   existingCustomer.Quantity + customer.Quantity; // Example for Amount
        // Ensure Quantity is added correctly as an integer
        existingCustomer.Quantity += customer.Quantity;

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchCustomers();
    }
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
    window.localStorage.setItem('currCustId', id);

    const customer = customers.find((customer) => customer._id === id);
    setCurrentCustomerId(id);
    setSelectedNotes(customer.Notes); // Ensure you set the selected notes from the customer object
    setCurrentCustomer(customer);

    setOpenUpdateDetailsModal(true);
  };

  const handleEye = (id) => {
    window.localStorage.setItem('currCustId', id);
    const customer = customers.find((customer) => customer._id === id);
    setCurrentCustomerId(id);
    setSelectedNotes(customer.Notes); // Ensure you set the selected notes from the customer object
    setCurrentCustomer(customer);
    setOpenNotesModal(true);
  };

  const confirmUpdateDetails = async (updatedData) => {
    try {
      const updatedCustomer = await updateCustomer(
        currentCustomer._id,
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {Object.entries(tableFields).map(([key, value]) => {
            return (
              <label key={key}>
                {key}
                <input
                  type='checkbox'
                  checked={value}
                  onChange={(e) => {
                    setTableFields((pv) => ({
                      ...pv,
                      [key]: !value,
                    }));
                  }}
                />
              </label>
            );
          })}
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
                {tableFields.Name && <th>Name</th>}
                {tableFields.Magazine && <th>Magazine</th>}
                {tableFields.Amount && (
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={sortCustomersByAmount}
                  >
                    Amount
                    {sortOrder === 'asc' ? (
                      <FontAwesomeIcon icon={faSortUp} className='sort-icon' />
                    ) : (
                      <FontAwesomeIcon
                        icon={faSortDown}
                        className='sort-icon'
                      />
                    )}
                  </th>
                )}
                {tableFields.Country_Code && <th>Country Code</th>}
                {tableFields.Email && <th>Email</th>}
                {tableFields.Address && <th>Address</th>}
                {tableFields.Order_id && <th>Order Id</th>}
                {tableFields.Model_Insta_Link ? <th>Insta Link</th> : null}
                {tableFields.Quantity && <th>Quantity</th>}
                {tableFields.Product && <th>Products</th>}
                {tableFields.Note && <th>Notes</th>}
                <th>Edit Note</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                return (
                  <tr key={customer._id}>
                    {tableFields.Name && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.First_Name} {customer.Last_Name}
                        </a>
                      </td>
                    )}
                    {tableFields.Magazine && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.Magazine}
                        </a>
                      </td>
                    )}
                    {tableFields.Amount && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.Amount}
                        </a>
                      </td>
                    )}
                    {tableFields.Country_Code && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.Country_Code}
                        </a>
                      </td>
                    )}
                    {tableFields.Email && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.Email}
                        </a>
                      </td>
                    )}
                    {tableFields.Address && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.Address}
                        </a>
                      </td>
                    )}
                    {tableFields.Order_id && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.Order_id}
                        </a>
                      </td>
                    )}
                    {tableFields.Model_Insta_Link ? (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.user_info?.Model_Insta_Link
                            ? customer.user_info.Model_Insta_Link
                            : 'N/A'}
                        </a>
                      </td>
                    ) : (
                      <td>N/A</td>
                    )}

                    {tableFields.Quantity && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.Quantity}
                        </a>
                      </td>
                    )}
                    {tableFields.Product && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.Product}
                          {/* <ul>
                            {customer.Product.split(', ').map(
                              (product, index) => (
                                <li key={index}>{product.trim()}</li>
                              )
                            )}
                          </ul> */}
                        </a>
                      </td>
                    )}
                    {/* <td>
                  {customer.Notes && customer.NoteDate ? (
                    <a
                      href={`/records/${customer._id}`}
                      className='link-cell'
                    >
                      {customer.Notes} -{' '}
                      {format(new Date(customer.NoteDate), 'MM/dd/yyyy')}
                    </a>
                  ) : (
                    <span>No data available</span> // Placeholder for empty data
                  )}
                </td> */}
                    {tableFields.Note && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {(customer.Notes != undefined ||
                            customer.Notes != null ||
                            customer.Notes == '') && (
                            <span>
                              {customer?.Notes} -{' '}
                              {new Date(customer?.NoteDate).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
                            </span>
                          )}
                        </a>
                      </td>
                    )}

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
                    </td>
                  </tr>
                );
              })}
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
          customer={currentCustomerId}
          setOpenUpdateDetailsModal={setOpenUpdateDetailsModal}
          confirmUpdateDetails={confirmUpdateDetails}
        />
      )}
    </div>
  );
};

export default CustomerTable;
