import React, { useState } from 'react';

const ColumnVisibilityToggle = ({ columns, onToggle }) => {
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => {
      acc[col.key] = true; // Initialize all columns as visible
      return acc;
    }, {})
  );

  const handleToggle = (key) => {
    const newVisibility = { ...visibleColumns, [key]: !visibleColumns[key] };
    setVisibleColumns(newVisibility);
    onToggle(newVisibility);
  };

  return (
    <div className='column-visibility-toggle'>
      <h4>Toggle Columns</h4>
      {columns.map((column) => (
        <div key={column.key}>
          <label>
            <input
              type='checkbox'
              checked={visibleColumns[column.key]}
              onChange={() => handleToggle(column.key)}
            />
            {column.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ColumnVisibilityToggle;
