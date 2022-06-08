import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChapter } from '../slices/bookSlice.js';
import { fetchData } from '../slices/bookSlice.js';


const List = () => {
  const dispatch = useDispatch();
  const { chapters, currentChapterId, bookParts } = useSelector((state) => state.book);
  const { currentPath } = useSelector((state) => state.user);
  const [{ partId }] = chapters.filter(({ id }) => id === currentChapterId);

  const [currentPart, setCurrentPart] = useState(partId);

  const handleShowPart = (id) => (e) => {
    e.preventDefault();
    setCurrentPart(id);
  };

  const handleShowChapter = (id, chapterNum) => (e) => {
    e.preventDefault();
    if (currentPath === '/app/home' && id !== currentChapterId) {
      dispatch(setCurrentChapter(id));
      dispatch(fetchData(chapterNum));
    } else if (currentPath === '/app/progress' && id !== currentChapterId) {
      dispatch(setCurrentChapter(id));
      dispatch(fetchData(chapterNum));
    }
  };

  return (
    <>
      { bookParts.map(({ partName, id }) => (
        <li key={`${id}${partName}`} className="list-group-item">
          {partName}
          <ul className="list-group list-group-flush">
            {
              chapters
                .filter(({ partId }) => partId === id)
                .map(({ chapterName, id: chapterId, chapterNum }) => (
                  <li className='liChapter list-group-item' key={`${id}${chapterId}`}>
                    <a href='#' onClick={handleShowChapter(chapterId, chapterNum)} className="text-decoration-none text-break">{chapterName}</a>
                  </li>
                ))
            }
          </ul>
        </li>
      )) }
    </>
  )
};

export default List;
