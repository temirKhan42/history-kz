import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const RenderLineChart = ({ data, xAxis, yAxis, title }) => (
  <>
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 15, right: 5, bottom: 0, left: 0 }}
    >
      <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey={xAxis} />
      <YAxis />
      <Tooltip />
    </LineChart>
    <h3>{title}</h3>
  </>
);

export default RenderLineChart;
