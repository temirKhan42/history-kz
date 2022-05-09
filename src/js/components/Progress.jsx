import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';
import SummaryList from './SummaryList.jsx';
import RenderLineChart from './RenderLineChart.jsx';
import RenderPieChart from './RenderPieChart.jsx';


export default function Progress() {
  const dispatch = useDispatch();
  const { chapters } = useSelector((state) => state.book);
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

  const dataPie = [
    { value: 100 },
    { value: 700 },
  ];

  return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Progress</h2>
      {chapters.length === 0 ? null : <SummaryList summaryFor={PROGRESS_SUMMARY}/>}
      <RenderLineChart data={data} xAxis={'name'} yAxis={'uv'} title={'chapter chart'} />
      <RenderPieChart data={dataPie} title={'current chapter 1'} />
      <RenderLineChart data={data} xAxis={'name'} yAxis={'uv'} title={'book chart'} />
    </main>
  );
}
