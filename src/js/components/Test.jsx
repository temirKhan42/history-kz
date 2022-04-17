import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import { setCurrentPath } from '../slices/userSlice.js';
import { setCurrentTestIndex, resetUserAnswers } from '../slices/bookSlice.js';
import CurrentTest from './CurrentTest.jsx';
import routes from '../routes/index.js';
import useAuth from '../hooks/index.js';


const postTests = async (option) => {
  console.log(option);
  const { data } = await axios.post(routes.postTests(), option);
  console.log('POST');
  return data;
};

export default function Test() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();

  const { 
    currentTestIndex, 
    chapterTests, 
    userAnswers, 
  } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const handleClick = (i) => (e) => {
    console.log(e);
    dispatch(setCurrentTestIndex(currentTestIndex + i));
  };

  const handleFinishTest = async () => {
    try {
      const userId = auth.user.id;
      const data = await postTests({ userId, userAnswers });
      dispatch(resetUserAnswers());
      navigate('/app/home');
      console.log('posted');
    } catch (err) {
      console.error('Some error appear. Your tests did not save.')
    }
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
      
      {
        currentTestIndex + 1 >= chapterTests.length &&
        userAnswers.length === chapterTests.length &&
        userAnswers.every(({ answerIds }) => answerIds.length > 0) ? (
          <button
            onClick={handleFinishTest}
          >
            Finish test
          </button>
        ) : (
          <button 
            onClick={handleClick(1)}
            disabled={currentTestIndex + 1 >= chapterTests.length}
          >
            Next
          </button>
        )
      }
    </main>
  );
}
