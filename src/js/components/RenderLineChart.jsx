import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const RenderLineChart = ({ data, date, line1, line2, title }) => (
  <>
    <h3 className='graphTitle h4 text-center'>{title}</h3>
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 15, right: 5, bottom: 0, left: 0 }}
      className='mb-5 mx-auto'
    >
      <Line type="monotone" dataKey={line1} stroke="#8884d8" />
      <Line type="monotone" dataKey={line2} stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey={date} />
      <YAxis />
      <Tooltip />
    </LineChart>
  </>
);

export default RenderLineChart;
