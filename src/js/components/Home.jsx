import React, { useEffect } from 'react';
import {
  useNavigate,
} from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../slices/pathSlice.js';
import useAuth from '../hooks/index.js';

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const navigate = useNavigate();
  const auth = useAuth();

  const handleClick = (e) => {
    e.preventDefault();
    auth.signout(() => navigate('/login'));
  };

  return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Home</h2>
      <button type="button" onClick={handleClick}>Exit</button>
    </main>
  );
}
