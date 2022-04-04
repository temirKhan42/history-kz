import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { setCurrentPath } from '../slices/userSlice.js';
import { setCurrentTest } from '../slices/bookSlice.js';
import CurrentTest from './CurrentTest.jsx';

export default function Test() {
  const dispatch = useDispatch();

  const { currentTest } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const handleClick = (test) => (e) => {
    console.log(e);
    dispatch(setCurrentTest(test));
  };

  return (
    <main>
      <h2>Test</h2>
      <CurrentTest />
      <button 
        onClick={handleClick(currentTest.prev)} 
        disabled={currentTest.prev === null}
      >
        Previous
      </button>
      
      <button 
        onClick={handleClick(currentTest.next)} 
        disabled={currentTest.next === null}
      >
        Next
      </button>
    </main>
  );
}
