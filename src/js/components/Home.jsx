import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath, setIsTesting } from '../slices/userSlice.js';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { 
  fetchData,
  fetchTests,
  setCurrentTestIndex,
  setChapterTests,
  setBookParts, 
  setBookChapters,
  setCurrentChapter,
  setTestsResults,
} from '../slices/bookSlice.js';
import useAuth from '../hooks/index.js';

const getParsingText = (text) => {
  const result = text.split('\n')
    .map((paragraph, i) => (<p className='fs-5' key={i}>{paragraph}</p>));

  return result;
};

export default function Home() {
  const dispatch = useDispatch();
  const auth = useAuth();
  const {
    chapters,
    currentChapterName,
    currentText,
    tests,
    currentChapterId,
  } = useSelector((state) => state.book);

  const HOME_SUMMARY = 'HOME_SUMMARY';

  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
    
    if (chapters.length === 0) {
      dispatch(setBookParts(auth.user.bookParts));
      dispatch(setBookChapters(auth.user.chapters));
      dispatch(setTestsResults(auth.user.testsResults));
      const { id: firstChapterId } = auth.user.chapters[0];
      dispatch(setCurrentChapter(firstChapterId));
    }
    
    if (currentText === null) {
      const INITIAL_CHAPTER_NUM = '1';
      dispatch(fetchData(INITIAL_CHAPTER_NUM));
    }
    
    if (tests.length === 0) {
      dispatch(fetchTests(auth.user.id));
    }
  }, []);

  const handleTestClick = (e) => {
    const chapterTests = _.shuffle(tests.filter(({ chapterId }) => chapterId === currentChapterId));
    dispatch(setChapterTests(chapterTests));
    dispatch(setCurrentTestIndex(0));
    dispatch(setIsTesting());
  };

  return (
    <main className='home'>
      <section className='subject container mx-auto my-5'>
        <h3 className='h3 my-5'>{currentChapterName}</h3>
        <article>
          {currentText === null ? null : getParsingText(currentText)}
        </article>
        <div className="d-grid gap-2 col-6 mx-auto">
          <Link className="btn btn-primary" type="button" to="/app/test" onClick={handleTestClick}>Test</Link>
        </div>
      </section>
    </main>
  );
}
