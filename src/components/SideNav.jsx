import NavItem from './NavItem';
import { NavLink } from 'react-router-dom';
import './sideNav.css'; 
import logo from '../assets/logo.jpg';
import Logout from '../components/NavLogout'

const SideNav = () => {
  return (
    <div className="side-nav">
      <div className="logo-img">
        <img src={logo} alt="Logo" />
      </div>

      <div className="nav-items">

        <NavLink to="/Dashboard">
          <NavItem navIcon={"fa-solid fa-table-cells-large"} />
        </NavLink>
      
        <NavLink to="/Customer">
          <NavItem navIcon={"fa-solid fa-user-group"} />
        </NavLink>
        
        <NavLink to="/AccessRole">
          <NavItem navIcon={"fa-solid fa-gear"} />
        </NavLink>
      </div>

      <Logout />
    </div>
  );
};

export default SideNav;