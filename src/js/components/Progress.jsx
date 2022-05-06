import React, { useEffect, PureComponent } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';
import SummaryList from './SummaryList.jsx';
import RenderLineChart from './RenderLineChart.jsx';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const dat = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class Example extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={dat}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dat.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}


export default function Progress() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const PROGRESS_SUMMARY = 'PROGRESS_SUMMARY';

  const data = [
    {name: '', uv: 400},
    {name: '', uv: 500},
    {name: '', uv: 800},
    {name: '', uv: 100},
  ];

  return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Progress</h2>
      <SummaryList summaryFor={PROGRESS_SUMMARY}/>
      <RenderLineChart data={data} xAxis={'name'} yAxis={'uv'} title={'chapter chart'} />
      <Example />
      <RenderLineChart data={data} xAxis={'name'} yAxis={'uv'} title={'book chart'} />
    </main>
  );
}
