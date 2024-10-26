import React, { useState } from 'react';
import './stats.css';
import StatItem from './StatItem';

const Stats = () => {
  const [stats] = useState([
    {
      statIcon: 'fa-solid fa-users',
      statTitle: 'Total Customers',
      statValue: '5,423',
    },
    {
      statIcon: 'fa-solid fa-user-check',
      statTitle: 'Admins',
      statValue: '3',
    },
    {
      statIcon: 'fa-solid fa-book-open',
      statTitle: 'Total Magazines',
      statValue: '189',
    },
  ]);

  return (
    <div className='stats-container'>
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <StatItem
            statIcon={stat.statIcon}
            statTitle={stat.statTitle}
            statValue={stat.statValue}
          />
          {index < stats.length - 1 && <hr className='vertical-hr' />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stats;
