import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath, setIsTesting } from '../slices/userSlice.js';
import { Link } from 'react-router-dom';
import _, { first } from 'lodash';
import SummaryList from './SummaryList.jsx';
import { fetchData, fetchTests, setCurrentTest, setChapterTests } from '../slices/bookSlice.js';
import useAuth from '../hooks/index.js';

const getParsingText = (text) => {
  const result = text.split('\n')
    .map((paragraph, i) => (<p key={i}>{paragraph}</p>));

  return result;
};

const getLinkedTests = (chapterTests) => {
  
  const lastIdx = chapterTests.length - 1;
  const firstIdx = 0;
  
  const r = (list, current, i) => {
    if (i === lastIdx) {
      return current;
    }

    const crnt = current === null ? {
      test: list[i],
      testNumber: i + 1,
      next: 
    } : current;
    
    return r(list, crnt, i + 1);
  };

  r(chapterTests, null, firstIdx);
}


const getFirstTest = (chapterTests) => {
  const [firstTest] = chapterTests.map((test, index, list) => {
    const prev = index - 1 < 0 ? null : list[index - 1];
    const next = index + 1 === list.length ? null : list[index + 1];
    return {
      prev,
      next,
      test,
      testNumber: index + 1,
    }
  });

  return firstTest;
};

export default function Home() {
  const dispatch = useDispatch();
  const auth = useAuth();
  const { currentChapterName, currentText, tests, currentChapterId } = useSelector((state) => state.book);

  const HOME_SUMMARY = 'HOME_SUMMARY';

  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));

    if (tests.length === 0) {
      dispatch(fetchTests(auth.user.id));
    }
    
    if (currentText === null) {
      const INITIAL_CHAPTER_NUM = '1';
      dispatch(fetchData(INITIAL_CHAPTER_NUM));
    }
  }, []);

  const handleTestClick = (e) => {
    const chapterTests = _.shuffle(tests.filter(({ chapterId }) => chapterId === currentChapterId));
    const firstTest = getFirstTest(chapterTests);
    console.log(chapterTests);
    dispatch(setChapterTests(chapterTests));
    dispatch(setCurrentTest(firstTest));
    dispatch(setIsTesting());
  };

  return (
    <main>
      <SummaryList summaryFor={HOME_SUMMARY}/>
      <section>
        <h3>{currentChapterName}</h3>
        <article>
          {currentText === null ? null : getParsingText(currentText)}
        </article>
      </section>
      <Link to="/app/test" onClick={handleTestClick}>Test</Link>
    </main>
  );
}
