import React from 'react';    
import { useDispatch, useSelector } from 'react-redux';
import { addUserAnswer, removeUserAnswer } from '../slices/bookSlice.js';

const CurrentTest = () => {
  const dispatch = useDispatch();

  const {
    currentTestIndex,
    chapterTests,
    userAnswers,
  } = useSelector((state) => state.book);

  const handleChange = (e) => {
    console.dir(e.target);
    const [curTestId, curAnswerId] = e.target.id.split('-');
    const answerIds = [curAnswerId];
    
    const userAnswer = {
      testId: curTestId,
      answerIds,
    };

    const isAnswerChecked = userAnswers.some(({ testId, answerIds }) => (
      `${testId}` === `${curTestId}` && answerIds.some((id) => `${id}` === `${curAnswerId}`)
    ));

    console.log(isAnswerChecked);

    dispatch(isAnswerChecked ? removeUserAnswer(userAnswer) : addUserAnswer(userAnswer));
  }

  const isChecked = (curTestId, curAnswerId) => {
    console.log(userAnswers);
    const isAnswerChecked = userAnswers.some(({ testId, answerIds }) => (
      `${testId}` === `${curTestId}` && answerIds?.some((id) => `${id}` === `${curAnswerId}`)
    ));
    
    return isAnswerChecked;
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
                  checked={!!(isChecked(test?.id, id))}
                  name={`testId:${test?.id}`}
                  value={`${test?.id}-${id}`}
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