import './customer.css';
import Menubar from '../components/Menubar';
import Stats from '../components/Stats'; 
import CustomerTable from '../components/CustomerTable'; 

const Customer = () => {
  return (
    <div className='customer-body'>
      <Menubar heading='Customers' />
      <div className='customer-content'>
        <Stats />
        <CustomerTable />
      </div>
    </div>
  );
};

export default Customer;
