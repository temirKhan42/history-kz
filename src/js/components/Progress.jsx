import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';
import SummaryList from './SummaryList.jsx';
import RenderLineChart from './RenderLineChart.jsx';
import RenderPieChart from './RenderPieChart.jsx';
import { result } from 'lodash';


export default function Progress() {
  const dispatch = useDispatch();
  const { 
    chapters, 
    testsResults, 
    currentChapterId, 
    currentChapterName 
  } = useSelector((state) => state.book);
  
  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const PROGRESS_SUMMARY = 'PROGRESS_SUMMARY';

  const [chapterData] = testsResults
    .filter(({ chapterId }) => chapterId === currentChapterId)
    .map(({ results }) => {
      return results.map((result) => {
        return { 
          ...result, 
          date: new Date(result.date).toLocaleString('en-GB', { timeZone: 'UTC' }), 
        }
      });
    }); //[ {date: '', allAnswers: 20, correctAnswers: 12} ];

  const [chapterDataPie] = testsResults
    .filter(({ chapterId }) => chapterId === currentChapterId)
    .map(({ results }) => {
      const { allAnswers, correctAnswers } = results[results.length - 1];
      console.log(allAnswers, correctAnswers);
      return [{ value: correctAnswers }, { value: allAnswers - correctAnswers }];
    })
    //[{ value: 100 }, { value: 700 }];
  
  console.log(chapterDataPie);
  return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Progress</h2>
      {chapters.length === 0 ? null : <SummaryList summaryFor={PROGRESS_SUMMARY}/>}
      <RenderLineChart 
        data={chapterData} 
        xAxis={'date'} 
        yAxis={'correctAnswers'} 
        title={`График пройденных тестов по главе: ${currentChapterName}`}
      />
      <RenderPieChart 
        data={chapterDataPie} 
        title={`График последнего теста главы ${currentChapterName}`} 
      />
    </main>
  );
}
