import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RenderAreaChart = ({ data, title }) => {
  return (
    <>
      <h3 className='graphTitle'>{title}</h3>
      <AreaChart
        width={600}
        height={300}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="everAnsweredQs" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="rightAnsweredQs" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </>
  )
};

export default RenderAreaChart;
