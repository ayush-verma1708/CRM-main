import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';


const PieChartComponent = ({graphTitle, data, color}) => {
  

  const COLORS = color;
 
  return (<>
    <h2 style={{padding:'1rem', textAlign:'center', color:'#092C4C'}}>{graphTitle}</h2>
    <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie
        data={data}
        cx="40%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend
          layout="vertical"
          verticalAlign="middle"
          align='right'
          wrapperStyle={{right: 80}}
          iconType="circle"
        />
    </PieChart>
    </ResponsiveContainer>
    </>
  );
};

export default PieChartComponent;
