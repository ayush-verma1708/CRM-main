import { useEffect, useState } from 'react';
import './dashboard.css';
import Menubar from '../components/Menubar';
import { fetchAdmins } from '../services/FirestoreManager';
import '../components/stats.css';
import StatItem from '../components//StatItem';
import PieChartComponent from '../components/PieChartComponent';

const Dashboard = () => {

  const customerGraphData = [
    { name: 'Alphero', value: 20 },
    { name: 'Blackcruze', value: 150 },
    { name: 'Blaze', value: 250 },
    { name: 'Con', value: 100 },
    { name: 'Envy', value: 50 },
    { name: 'Mac', value: 70 },
    { name: 'Magblack', value: 40 },
    { name: 'Mirror', value: 60 },
    { name: 'Uncover', value: 80 },
    { name: 'Will', value: 50 }
  ];

  const COLORS1 = ['#05495c', '#005e6a', '#00726b', '#FF8042', '#00855e', '#3a9646', '#79a224', '#baa900', '#ffa600', '#ffc63b'];

  const salesGraphData = [
    { name: 'Alphero', value: 120 },
    { name: 'Blackcruze', value: 60 },
    { name: 'Blaze', value: 20 },
    { name: 'Con', value: 70 },
    { name: 'Envy', value: 10 },
    { name: 'Mac', value: 40 },
    { name: 'Magblack', value: 40 },
    { name: 'Mirror', value: 60 },
    { name: 'Uncover', value: 80 },
    { name: 'Will', value: 50 }
  ];
  const COLORS2 = ['#5c0d29', '#791b2f', '#962b32', '#b13f32', '#ca552f', '#e06e28', '#f2891b', '##ffa600', '#d75a4d', '#9d4058'];

  const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const getAdmins = async () => {
            const adminList = await fetchAdmins();
            setAdmins(adminList);
        };

        getAdmins();
    }, []);
    

  return (
    <div className='dashboard-body'>
      <Menubar heading='Dashboard'/>
      <div className='dashboard-content'>
          <div className="dashboard-divs">
            <div className="first"></div>
            <div className="second">
              <PieChartComponent graphTitle={"Total Customers"} data={customerGraphData} color={COLORS1}/>
            </div>
            <div className="third">
              <StatItem statIcon={"fa-solid fa-users user-icon"} statTitle={"Customers"} statValue={"130"} />
            </div>
            <div className="fourth">
              <PieChartComponent graphTitle={"Total Sales"} data={salesGraphData} color={COLORS2}/>
            </div>
            <div className="fifth">
            <StatItem className='dashboard-stat-item' statIcon={"fa-solid fa-briefcase brief-icon"} statTitle={"Sales"} statValue={"230"} />
            </div>
          </div>
          <div className="dashboard-admin">
          <h3 style={{color:'#092C4C', fontSize:'1rem', padding:'2rem'}}>Admins</h3>
            <ul style={{listStyleType:'none', padding:'0 2rem', }}>
              {admins.map(admin => (
                <li className='admin-li' key={admin.uid}>
                  <span className="admin-name">{admin.name}</span> 
                  <span className="admin-email">{admin.email}</span>
                </li>
              ))}
            </ul>
          </div>
      </div>
    </div>
  )
}

export default Dashboard