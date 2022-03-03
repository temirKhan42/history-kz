import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/pathSlice.js';
import { Link } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Home</h2>

      <Link to="/app/test">Test</Link>
    </main>
  );
}
