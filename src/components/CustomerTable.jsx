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
  const [NewfilteredCustomers, setNewFilteredCustomers] = useState(customers);
  const [page, setPage] = useState(1);
  const [limit] = useState(100); // Number of records per page
  const [totalRecords, setTotalRecords] = useState(0); // Total records from API
  const [selectedMagazine, setSelectedMagazine] = useState(''); // For magazine filter
  const uniqueMagazines = [
    ...new Set(customers.map((customer) => customer.Magazine)),
  ];

  const handleMagazineChange = (e) => {
    setSelectedMagazine(e.target.value); // Update the selected magazine
  };
  const [tableFields, setTableFields] = useState({
    Name: true,
    Magazine: true,
    Amount: true,
    Country_Code: false,
    Email: true,
    Order_id: true,
    Address: false,
    Product: false,
    // Quantity: false,
    Model_Insta_Link: true,
    Note: true,
    Follow_Up_Date: true,
  });

  // Price range states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  // Function to fetch records from the server
  // const loadRecords = async () => {
  //   try {
  //     const data = await fetchRecords(); // Adjust this according to your API
  //     setRecords(data); // Update records state
  //   } catch (error) {
  //     console.error('Error fetching records:', error);
  //   }
  // };
  // Load records on component mount

  // // Fetch records from the server
  // const loadRecords = async () => {
  //   try {
  //     const data = await fetchRecords(page, limit); // Fetch records with pagination
  //     setCustomers(data.records);
  //     setTotalRecords(data.total); // Assuming your API returns total records
  //   } catch (error) {
  //     console.error('Error fetching records:', error);
  //     setError('Error fetching records');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Load records from server, include pagination

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await fetchRecords(page, limit); // Fetch with pagination
      setCustomers(data.records);
      setTotalRecords(data.total); // Set total records for calculating pages
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Error fetching records');
    } finally {
      setLoading(false);
    }
  };

  // Pagination controls
  const totalPages = Math.ceil(totalRecords / limit); // Calculate total pages

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => {
        const newPage = prevPage - 1;

        loadRecords(newPage); // Call loadRecords with the new page
        return newPage;
      });
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      loadRecords(newPage); // Call loadRecords with the new page
      return newPage;
    });
  };

  // const handlePreviousPage = () => {
  //   if (page > 1) {
  //     setPage(page - 1); // Decrement page
  //   }
  //   loadRecords();
  // };

  // const handleNextPage = () => {
  //   if (page < totalPages) {
  //     setPage(page + 1); // Increment page
  //   }
  //   loadRecords();
  // };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const filteredCustomers = customers.filter((customer) => {
    const amount = parseFloat(customer.Amount);
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    const isWithinMin = isNaN(min) || amount >= min;
    const isWithinMax = isNaN(max) || amount <= max;

    return isWithinMin && isWithinMax;
  });

  const handleNotesUpdated = () => {
    loadRecords(); // Refresh records after note update
  };

  const handleSearch = (query) => {
    const tokens = query.toLowerCase().split(' ').filter(Boolean); // Split by space and remove empty strings
    const filtered = customers.filter((customer) =>
      tokens.every(
        (token) => customer.name.toLowerCase().includes(token) // Check if each token matches any part of the name
      )
    );
    setNewFilteredCustomers(filtered);
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    handleSearch(value); // Call search on every input change
  };

  // Updated fetchCustomers function
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecords(
        1,
        100,
        search,
        minPrice,
        maxPrice,
        selectedMagazine
      );
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
      const email1 = customer.Email || '';
      const email2 = customer.Email || '';
      const emailKey = email1 === email2 ? email1 : `${email1}_${email2}`;

      if (emailMap[emailKey]) {
        const existingCustomer = emailMap[emailKey];

        existingCustomer.Product = existingCustomer.Product
          ? `${existingCustomer.Product}\n- ${customer.Product}` // Append new item with bullet point
          : `- ${customer.Product}`;

        existingCustomer.Magazine += `, ${customer.Magazine}`;
        existingCustomer.Amount = Math.round(
          existingCustomer.Amount + customer.Amount
        );

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
  }, [search, minPrice, maxPrice, selectedMagazine]);

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

  useEffect(() => {
    loadRecords();
    window.localStorage.removeItem('currCustId');
  }, [page]);

  return (
    <div className='customer-table-container'>
      <div className='table-header'>
        <div className='leftHeader'>
          <h3>All Customers</h3>
        </div>
        {/* Other components and rendering logic */}
        {/* <select value={selectedMagazine} onChange={handleMagazineChange}>
          <option value=''>All Magazines</option>
          {uniqueMagazines.map((magazine, index) => (
            <option key={index} value={magazine}>
              {magazine}
            </option>
          ))}
        </select> */}

        <div
          style={{
            gap: '12px',
            flexDirection: 'row',
            display: 'flex',

            padding: '16px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          {Object.entries(tableFields).map(([key, value]) => (
            <div
              key={key}
              style={{
                // alignItems: 'center',
                padding: '8px',
                backgroundColor: '#ffffff',
                borderRadius: '4px',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
              }}
            >
              <input
                type='checkbox'
                checked={value}
                onChange={() =>
                  setTableFields((prev) => ({
                    ...prev,
                    [key]: !value,
                  }))
                }
                style={{ marginRight: '8px' }}
              />
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  cursor: 'pointer',
                }}
              >
                {key}
              </label>
            </div>
          ))}
        </div>
        <div className='rightHeader'>
          <div className='search-customer'>
            <input
              className='search-bar'
              type='text'
              placeholder='Search'
              value={search}
              onChange={handleChange}
            />
            <i className='fa-solid fa-magnifying-glass'></i>
            <div>
              {filteredCustomers.map((customer) => (
                <div key={customer.id}>{customer.name}</div>
              ))}
            </div>
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
              <div className='pagination-controls'>
                <button onClick={handlePreviousPage} disabled={page === 1}>
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={page === index + 1 ? 'active' : ''}
                  >
                    {index + 1}
                  </button>
                ))}
                <button onClick={handleNextPage} disabled={page === totalPages}>
                  Next
                </button>
              </div>
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
                {tableFields.Model_Insta_Link && <th>Insta Link</th>}
                {tableFields.Product && <th>Products</th>}
                {tableFields.Note && <th>Notes</th>}
                {tableFields.Follow_Up_Date && <th>Date</th>}
                <th>Edit Note</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                return (
                  <tr key={customer._id}>
                    {tableFields.Name && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {customer.Full_Name}
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
                          $ {customer.Amount}
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
                    {tableFields.Model_Insta_Link && (
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
                    )}

                    {tableFields.Product && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          <ul style={{ paddingLeft: '16px', margin: 0 }}>
                            {customer.Product.split(',').map(
                              (product, index) => (
                                <li
                                  key={index}
                                  style={{
                                    listStyleType: 'disc',
                                    marginBottom: '4px',
                                  }}
                                >
                                  {product.trim()}
                                </li>
                              )
                            )}
                          </ul>
                        </a>
                      </td>
                    )}

                    {tableFields.Note && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {(customer.Notes != undefined ||
                            customer.Notes != null ||
                            customer.Notes == '') && (
                            <span>{customer?.Notes}</span>
                          )}
                        </a>
                      </td>
                    )}
                    {tableFields.Follow_Up_Date && (
                      <td>
                        <a
                          href={`/records/${customer._id}`}
                          className='link-cell'
                        >
                          {(customer.Follow_Up_Date != undefined ||
                            customer.Follow_Up_Date != null ||
                            customer.Follow_Up_Date == '') && (
                            <span>
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
