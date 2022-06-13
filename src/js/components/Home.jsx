import React, { useEffect, useState } from 'react';
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
import images from '../../data/images/index.js';


const getParsingText = (text) => {
  if (text.slice(0, 11) === '#chronology') {
    return (<ol className="list-group list-group-flush">
      {
        text.split('\n')
          .filter((p, i) => i !== 0)
          .map((paragraph, i) => {
            return <li className='list-group-item fs-6 p-2' key={i}>{paragraph}</li>
        })
      }
    </ol>); 
  }

  if (text.slice(0, 8) === '#glosary') {
    return (<ol className="list-group list-group-flush">
      {
        text.split('\n')
          .filter((p, i) => i !== 0)
          .map((paragraph, i) => {
            return <li className='list-group-item fs-6 p-2' key={i}>{paragraph}</li>
        })
      }
    </ol>); 
  }

  const result = text.split('\n')
    .map((paragraph, i) => {
      const image = Object.entries(images).find(([key]) => paragraph === `img-${key}`)
      if (image) {
        const [imgName, imgUri] = image;
        console.log(imgName);
        return <img key={`${paragraph}${i}`} style={{ width: '300px', height: '300px' }} className='mx-auto' src={imgUri} alt='hero' />
      }
      return <p className='fs-6' key={i}>{paragraph}</p>
  });

  return result;
};

export default function Home() {
  const [navBtnVal, setNavBtnVal] = useState('Вниз');

  const dispatch = useDispatch();
  const auth = useAuth();
  const {
    chapters,
    currentChapterName,
    currentText,
    tests,
    currentChapterId,
  } = useSelector((state) => state.book);

  console.dir(document.getElementById('root').firstElementChild);
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
      const INITIAL_CHAPTER_NUM = '0';
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

  const handleNavBtn = () => {
    navBtnVal === 'Вниз' ? setNavBtnVal('Вверх') : setNavBtnVal('Вниз');
  };

  return (
    <main className='home position-relative'>
      <section className='subject container mx-auto my-5'>
        <h3 className='h3 my-5'>{currentChapterName}</h3>
        <article>
          {currentText === null ? null : getParsingText(currentText)}
        </article>
        <div id="footer" className='mb-5'></div>
        {
          currentChapterName === 'Введение' || currentChapterName === 'ХРОНОЛОГИЧЕСКАЯ ТАБЛИЦА ВАЖНЕЙШИХ СОБЫТИЙ ПО ПРЕДМЕТУ «ИСТОРИЯ КАЗАХСТАНА»' || currentChapterName === 'Глоссарий' ? null :
          <div className="d-grid gap-2 col-6 mx-auto" id="test">
            <Link id="test" className="btn btn-primary" type="button" to="/app/test" onClick={handleTestClick}>Перейти к тесту</Link>
          </div>
        }
      </section>

      <nav className="position-fixed top-50 end-0">
        {
          navBtnVal === 'Вниз' ?
            <a className="btn btn-primary me-5" type="button" onClick={handleNavBtn} href="#header">{navBtnVal}</a> :
            <a className="btn btn-primary me-5" type="button" onClick={handleNavBtn} href="#footer">{navBtnVal}</a>
        }

      </nav>
    </main>
  );
}
