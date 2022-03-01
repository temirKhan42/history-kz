import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/pathSlice.js';

export default function Progress() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Progress</h2>
    </main>
  );
}
