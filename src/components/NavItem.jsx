import './navItem.css'; 

const NavItem = ({navIcon}) => {
  return (
    <div className='round'>    
      <div className="nav-item">
        <i className={navIcon}></i>
      </div>
    </div>
  );
};

export default NavItem;