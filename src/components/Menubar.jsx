import profilePhoto from '../assets/profilePhoto.jpg';
import './menuBar.css'; 

const MenuBar = ( {heading} ) => {
  return (
    <div className="menu-bar">
      <h2 className="page-title">{heading}</h2>

      <div className="profile-img">
        <img src={profilePhoto} alt="Profile Photo" />
      </div>
    </div>
  );
};

export default MenuBar;
