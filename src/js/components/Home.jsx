import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from '../slices/pathSlice.js';
import { Link } from 'react-router-dom';
import SummaryList from './SummaryList.jsx';
import { fetchData } from '../slices/bookSlice.js';

const getParsingText = (text) => {
  return text.split('\n')
    .map((paragraph, i) => <p key={i}>{paragraph.slice(3, -4)}</p>)
};

export default function Home() {
  const dispatch = useDispatch();
  const { currentChapterName, currentText } = useSelector((state) => state.book);
  
  if (currentText === '') {
    const INITIAL_CHAPTER_NUM = '1';
    dispatch(fetchData(INITIAL_CHAPTER_NUM));
  }

  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const HOME_SUMMARY = 'HOME_SUMMARY';

  return (
    <main style={{ padding: '1rem 0' }}>
      <SummaryList summaryFor={HOME_SUMMARY}/>
      <section>
        <h3>{currentChapterName}</h3>
        <article>
          {currentText === null ? null : getParsingText(currentText)}
        </article>
      </section>
      <Link to="/app/test">Test</Link>
    </main>
  );
}
