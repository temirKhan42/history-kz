import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from '../slices/userSlice.js';
import RenderLineChart from './RenderLineChart.jsx';
import RenderPieChart from './RenderPieChart.jsx';
import RenderAreaChart from './RenderAreaChart.jsx';


export default function Progress() {
  const dispatch = useDispatch();
  const { 
    chapters, 
    tests,
    testsResults,
    allTestsResults,
    currentChapterId, 
    currentChapterName 
  } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(setCurrentPath(window.location.pathname));
  }, []);

  const PROGRESS_SUMMARY = 'PROGRESS_SUMMARY';

  const chapterTests = testsResults.filter(({ chapterId }) => chapterId === currentChapterId);

  const [chapterData] = chapterTests ? chapterTests.map(({ results }) => {
    return results.map((result) => {
      return {
        ...result,
        date: new Date(result.date).toLocaleString('en-GB', { timeZone: 'UTC' }),
      }
    });
  }) : [[]]; //[ {date: '', allAnswers: 20, correctAnswers: 12} ];

  const [chapterDataPie] = chapterTests ? chapterTests.map(({ results }) => {
    const { allAnswers, correctAnswers } = results[results.length - 1];
    return [{ value: correctAnswers }, { value: allAnswers - correctAnswers }];
  }) : [[]]; //[{ value: 100 }, { value: 400 }]

  // [{ date: '', rightAnsweredQs: 8, everAnsweredQs: 12 }]
  const [allTestsResultsPie] = allTestsResults.map(({ rightAnsweredQs }) => {
    return [{ value: rightAnsweredQs }, { value: tests.length - rightAnsweredQs }];
  }).reverse();

  console.log(chapterData);
  return (
    <main style={{ padding: '1rem 0' }}>
      <section className='container-80'>
        <div className='my-5'>
          <RenderAreaChart
            data={chapterData} 
            xAxis={'date'}
            yAxis={'correctAnswers'}
            title={`График пройденных тестов по главе: ${currentChapterName}`}
          />
          <RenderPieChart
            data={chapterDataPie} 
            title={`График последнего теста главы ${currentChapterName}`} 
          />
          <RenderLineChart
            data={allTestsResults}
            date={'date'} 
            line1={'rightAnsweredQs'} 
            line2={'everAnsweredQs'}
            title={'График всех правильных ответов ко всем отвеченным вопросам'}
          />
          <RenderPieChart
            data={allTestsResultsPie} 
            title={`График всех правильных ответов ко всем вопросам`} 
          />
        </div>
      </section>
    </main>
  );
}
