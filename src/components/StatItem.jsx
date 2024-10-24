import './statItem.css';

const StatItem = ({ statIcon, statTitle, statValue }) => {
  return (
      <div className="stat-item">
        <div className="stat-icon">
            <i className={statIcon}></i>
        </div>
        <div className="stat-info">
            <p>{statTitle}</p> 
            <h2>{statValue}</h2> 
        </div>
      </div>
  );
};

export default StatItem;



