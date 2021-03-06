import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import _ from 'lodash';

const COLORS = _.shuffle(['#FFBB28', '#FF8042', '#0088FE', '#00C49F']);
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const message = index === 0 ? 'Верных ответов' : 'Не верных ответов';
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(2)}%`}
    </text>
  );
};

const RenderPieChart = ({ data, title }) => {
  return (
    <>
      <h3 className='graphTitle h4 text-center'>{title}</h3>
      <PieChart width={400} height={400} className='mb-5 mx-auto'>
        <Pie
          startAngle={90}
          endAngle={-270}
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </>
  );
}

export default RenderPieChart;
