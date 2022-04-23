import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath, setIsTesting } from '../slices/userSlice.js';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import SummaryList from './SummaryList.jsx';
import { 
  fetchData, 
  fetchTests, 
  setCurrentTestIndex, 
  setChapterTests,
} from '../slices/bookSlice.js';
import useAuth from '../hooks/index.js';

const getParsingText = (text) => {
  const result = text.split('\n')
    .map((paragraph, i) => (<p key={i}>{paragraph}</p>));

  return result;
};

export default function Home() {
  const dispatch = useDispatch();
  const auth = useAuth();
  const { 
    currentChapterName, 
    currentText, 
    tests, 
    currentChapterId,
  } = useSelector((state) => state.book);

  const HOME_SUMMARY = 'HOME_SUMMARY';

  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));

    if (tests.length === 0) {
      console.log('from home check tests.length');
      dispatch(fetchTests(auth.user.id));
    }
    
    if (currentText === null) {
      console.log('from home check current text');
      const INITIAL_CHAPTER_NUM = '1';
      dispatch(fetchData(INITIAL_CHAPTER_NUM));
    }
  }, []);

  const handleTestClick = (e) => {
    const chapterTests = _.shuffle(tests.filter(({ chapterId }) => chapterId === currentChapterId));
    dispatch(setChapterTests(chapterTests));
    dispatch(setCurrentTestIndex(0));
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
