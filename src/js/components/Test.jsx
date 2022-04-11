import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { setCurrentPath } from '../slices/userSlice.js';
import { setCurrentTestIndex } from '../slices/bookSlice.js';
import CurrentTest from './CurrentTest.jsx';

export default function Test() {
  const dispatch = useDispatch();

  const { currentTestIndex, chapterTests } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const handleClick = (i) => (e) => {
    console.log(e);
    dispatch(setCurrentTestIndex(currentTestIndex + i));
  };

  return (
    <main>
      <h2>Test</h2>
      <CurrentTest />
      <button 
        onClick={handleClick(-1)} 
        disabled={currentTestIndex - 1 < 0}
      >
        Previous
      </button>
      
      <button 
        onClick={handleClick(1)} 
        disabled={currentTestIndex + 1 >= chapterTests.length}
      >
        Next
      </button>
    </main>
  );
}
