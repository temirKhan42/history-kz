import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from '../slices/pathSlice.js';
import { setCurrentChapter } from '../slices/bookSlice.js';
import { Link } from 'react-router-dom';

const getSummaryList = () => {
  const dispatch = useDispatch();
  const { chapters, currentChapterId, bookParts } = useSelector((state) => state.book.summary);

  const [{ partId }] = chapters.filter(({ id }) => id === currentChapterId);

  const [currentPart, setCurrentPart] = useState(partId);

  const handleShowPart = (id) => (e) => {
    e.preventDefault();
    setCurrentPart(id);
  };

  const handleShowChapter = (id) => (e) => {
    e.preventDefault();
    dispatch(setCurrentChapter(id));
  };

  return bookParts.map(({ partName, id }) => (
    <li key={`${id}${partName}`}>
      <a href="#" onClick={handleShowPart(id)}>{partName}</a>
      {currentPart === id ? (<ul>
        {
          chapters
            .filter(({ partId }) => partId === currentPart)
            .map(({ chapterName, id: chapterId }) => (
              <li key={`${id}${chapterId}`}>
                <a href='#' onClick={handleShowChapter(chapterId)}>{chapterName}</a>
              </li>
            ))
        }
      </ul>) : null}
    </li>
  ));
};

export default function Home() {
  const dispatch = useDispatch();
  const { currentChapterName } = useSelector((state) => state.book.summary);
  console.log(currentChapterName)
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  return (
    <main style={{ padding: '1rem 0' }}>
      <section>
        <h4>Содержание</h4>
        <ul>
          {getSummaryList()}
        </ul>
      </section>
      <section>
        <h3>{currentChapterName}</h3>
        <article>

        </article>
      </section>
      <Link to="/app/test">Test</Link>
    </main>
  );
}
