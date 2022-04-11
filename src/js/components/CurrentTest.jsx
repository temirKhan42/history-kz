import React from 'react';    
import { useDispatch, useSelector } from 'react-redux';
import { addUserAnswers } from '../slices/bookSlice.js';

const CurrentTest = () => {
  const dispatch = useDispatch();

  const { 
    currentTestIndex, 
    chapterTests, 
    userAnswers,
  } = useSelector((state) => state.book);

  const handleChange = (e) => {
    console.log(e);
    const [testId, answerId] = e.target.id.split('-');
    const answerIds = [answerId]
    const userAnswer = {
      testId,
      answerIds,
    };

    dispatch(addUserAnswers(userAnswer));
  }

  const isChecked = (curtTestId, curAnswerId) => (e) => {
    console.log(e);
    const result = userAnswers.some(({ testId, answerIds }) => {
      if (testId === curtTestId && answerIds.some((id) => id === curAnswerId)) {
        return true;
      }
      return false;
    });

    return result;
  };

  const test = chapterTests[currentTestIndex];

  return (
    <div>
      <h4>{currentTestIndex + 1}</h4>
      <p>{test?.question}</p>
      <form>
        <ul>
          {test?.answers.map(({ answer, id }) => {
            return (
              <li key={`${test?.id}-${id}`}>
                <label htmlFor={`${test?.id}-${id}`}>{answer}</label>
                <input
                  type="checkbox"
                  onChange={handleChange}
                  checked={isChecked(test?.id, id)}
                  name={`testId:${test?.id}`}
                  value={id}
                  id={`${test?.id}-${id}`}
                />
              </li>
            )
          })}
        </ul>
      </form>
    </div>
  )
};


export default CurrentTest;
