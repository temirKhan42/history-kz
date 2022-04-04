import React from 'react';    
import { useDispatch, useSelector } from 'react-redux';

const CurrentTest = () => {
  const { currentTest } = useSelector((state) => state.book);

  const { test, testNumber } = currentTest;
  console.log(currentTest);

  const handleChange = (e) => {
    console.log(e);
  }

  return (
    <div>
      <h4>{testNumber}</h4>
      <p>{test?.question}</p>
      <form onChange={handleChange()}>
        <ul>
          {test?.answers.map(({ answer, id }) => {
            return (
              <li key={`${test?.id}-${id}`}>
                <label htmlFor={`${test?.id}-${id}`}>{answer}</label>
                <input
                  type="checkbox"
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
