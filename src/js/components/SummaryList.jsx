import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChapter } from '../slices/bookSlice.js';
import { fetchData } from '../slices/bookSlice.js';

export default function SummaryList({ summaryFor }) {
  const dispatch = useDispatch();
  const { chapters, currentChapterId, bookParts } = useSelector((state) => state.book);

  const [{ partId }] = chapters.filter(({ id }) => id === currentChapterId);

  const [currentPart, setCurrentPart] = useState(partId);

  const handleShowPart = (id) => (e) => {
    e.preventDefault();
    setCurrentPart(id);
  };

  const handleShowChapter = (id, chapterNum) => (e) => {
    e.preventDefault();
    if (summaryFor === 'HOME_SUMMARY' && id !== currentChapterId) {
      dispatch(setCurrentChapter(id));
      dispatch(fetchData(chapterNum));
    }
  };

  return (<section>
    <h4>Содержание</h4>
    <ul>
      { bookParts.map(({ partName, id }) => (
        <li key={`${id}${partName}`}>
          <a href="#" onClick={handleShowPart(id)}>{partName}</a>
          {currentPart === id ? (<ul>
            {
              chapters
                .filter(({ partId }) => partId === currentPart)
                .map(({ chapterName, id: chapterId, chapterNum }) => (
                  <li key={`${id}${chapterId}`}>
                    <a href='#' onClick={handleShowChapter(chapterId, chapterNum)}>{chapterName}</a>
                  </li>
                ))
            }
          </ul>) : null}
        </li>
      )) }
    </ul>
  </section>)
};
