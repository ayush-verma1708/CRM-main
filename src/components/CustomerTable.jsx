import { useState } from 'react';
import DeleteCustomerModal from '../modals/DeleteCustomerModal';
import UpdateCustomerDetailsModal from '../modals/UpdateCustomerDetailsModal';
import NotesModal from '../modals/NotesModal';
import FilterModal from '../modals/FilterModal';
import { v4 as uuidv4 } from 'uuid';
import './customerTable.css';

const CustomerTable = () => {
    const [customers, setCustomers] = useState([
        { id: uuidv4(), firstName: 'Jane', lastName:'Cooper', phone: '53127328', email: 'jane@microsoft.com', countryCode: 'USD', amount:'60', notes: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit sapiente qui est a natus blanditiis eos nihil commodi. Minus eligendi beatae laudantium neque, accusamus voluptatum repellendus obcaecati fugit dicta exercitationem.' },
    { id: uuidv4(), firstName: 'John', lastName:'Doe', phone: '53127329', email: 'john@microsoft.com', countryCode: 'USD', amount:'70', notes: 'Hello there' },
    { id: uuidv4(), firstName: 'Alice', lastName:'Smith', phone: '53127330', email: 'alice@microsoft.com', countryCode: 'USD', amount:'80', notes: 'fake news fake news ' },
       ]);
    
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [openUpdateDetailsModal, setOpenUpdateDetailsModal] = useState(false);
    const [openNotesModal, setOpenNotesModal] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState('');

    

    const handleEye = (id) => {
        const customer = customers.find(customer => customer.id === id);
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

    const confirmDeleteCustomer = () => {
        if (customerToDelete !== null) {
            const newCustomers = customers.filter(customer => customer.id !== customerToDelete);
            setCustomers(newCustomers);
            setOpenDeleteModal(false);
        }
    };

    const handleEdit = (id) => {
        const customer = customers.find(customer => customer.id === id);
        setCurrentCustomer(customer);
        setOpenUpdateDetailsModal(true);
    };
    

    const confirmUpdateDetails = (updatedData) => {
        setCustomers((prevCustomers) =>
            prevCustomers.map((customer) =>
                customer.id === currentCustomer.id ? { ...customer, ...updatedData } : customer
            )
        );
        setOpenUpdateDetailsModal(false);
    };

    return (
        <div className="customer-table-container">
            <div className="table-header">
                <div className="leftHeader">
                    <h3>All Customers</h3>
                </div>
                <div className="rightHeader">
                    <div className='search-customer'>
                    <input className="search-bar" type="text" placeholder="Search" />
                    <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <i className="fa-solid fa-filter" style={{fontSize:'1.4rem' , color:'#8FA5B1', cursor:'pointer'}} onClick={() => handleFilter() } ></i>
                </div>
            </div>

            <table className="customer-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Country Code</th>
                        <th>Amount</th>
                        <th>Notes</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.firstName}</td>
                            <td>{customer.lastName}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.email}</td>
                            <td>{customer.countryCode}</td>
                            <td>{customer.amount}</td>
                            <td>
                                <button className="notes-btn" onClick={() => handleEye(customer.id)} >
                                    <i className="fa-solid fa-eye"></i>
                                </button>
                            </td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(customer.id)}>
                                    <i className="fa-solid fa-pencil"></i>
                                </button>
                            </td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDelete(customer.id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {openNotesModal && (
                <NotesModal
                    setOpenNotesModal={setOpenNotesModal}
                    notes={selectedNotes}
                />
            )}

            {openFilterModal && (
                <FilterModal
                    setOpenFilterModal={setOpenFilterModal}
                />
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
