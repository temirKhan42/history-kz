import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/pathSlice.js';
import SummaryList from './SummaryList.jsx';

export default function Progress() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const PROGRESS_SUMMARY = 'PROGRESS_SUMMARY';

  return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Progress</h2>
      <SummaryList summaryFor={PROGRESS_SUMMARY}/>
    </main>
  );
}
