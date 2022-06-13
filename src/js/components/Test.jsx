import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import { setCurrentPath, setIsTesting } from '../slices/userSlice.js';
import {
  setCurrentTestIndex,
  setCurrentTestState,
  setCurrentAnswerChecked,
  setTestsResults,
  setAllTestsResults,
  setWasCurrentTestAnswered,
  setIsUserAnswerCorrect,
  resetUserAnswers,
} from '../slices/bookSlice.js';
import CurrentTest from './CurrentTest.jsx';
import routes from '../routes/index.js';
import useAuth from '../hooks/index.js';


const postTests = async (option) => {
  const { data } = await axios.post(routes.postTests(), option);
  return data;
};

const checkAnswer = async (option) => {
  try {
    const { data } = await axios.post(routes.checkAnswer(), option);
    return data;
  } catch (err) {
    console.error(err);
  }
}

export default function Test() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();

  const [counter, setCounter] = useState(0);

  const {
    currentChapterId,
    currentTestIndex,
    currentTestState,
    chapterTests,
    isCurrentAnswerChecked,
    userAnswers,
  } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const handleClick = (i) => async (e) => {
    if (!isCurrentAnswerChecked) {
      return;
    }

    if (counter === 0) {
      const { isCorrect } = await checkAnswer({
        userId: auth.user.id,
        answer: currentTestState,
      });

      dispatch(setIsUserAnswerCorrect(isCorrect));
      dispatch(setWasCurrentTestAnswered(true));
      setCounter(1);
    } else if (counter === 1) {
      dispatch(setIsUserAnswerCorrect(null));
      dispatch(setWasCurrentTestAnswered(false));
      dispatch(setCurrentTestIndex(currentTestIndex + i));
      setCounter(0);
      dispatch(setCurrentAnswerChecked(false));
    }
  };

  const handleFinishTest = async () => {
    try {
      const userId = auth.user.id;
      const { testsResults, allTestsResults } = await postTests({ 
        userId,
        userAnswers,
        chapterId: currentChapterId
      });
      console.log(allTestsResults);
      console.log(testsResults);
      dispatch(setCurrentTestState(null));
      dispatch(setTestsResults(testsResults));
      dispatch(setAllTestsResults(allTestsResults));
      dispatch(resetUserAnswers());
      dispatch(setIsTesting());
      navigate('/app/home');
    } catch (err) {
      console.error('Some error appear. Your tests did not save.');
    }
  };

  return (
    <main className="test">
      <CurrentTest />
      <div className='dirrectBtns flex'>
      <div className="btn-group" role="group" aria-label="Basic example">
        {/* <button className="btn btn-primary" onClick={handleClick(-1)} type="button" disabled={currentTestIndex - 1 < 0}>
          Предыдущий
        </button> */}

        <button 
          className="btn btn-primary" 
          onClick={handleClick(1)} 
          type="button" 
          disabled={currentTestIndex + 1 >= chapterTests.length && counter > 0} 
        >
          Следующий
        </button>

        {
          userAnswers.length === chapterTests.length &&
          userAnswers.every(({ answerIds }) => answerIds.length > 0) &&
          counter > 0 ? (
            <button type="button" className="btn btn-primary" onClick={handleFinishTest} >
              Закончить тест
            </button>
          ) : null
        }
      </div>
      </div>
    </main>
  );
}
