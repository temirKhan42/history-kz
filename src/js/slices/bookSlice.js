import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import axios from 'axios';
import { BOOK_PARTS, BOOK_PART_DICT } from '../../data/index.js';
import routes from '../routes/index.js';

const getNextId = () => Number(_.uniqueId());

const setBookParts = (bookParts) => (bookParts.map((partName, index) => ({
  id: getNextId(),
  partName,
  partNum: index + 1,
})));

const setChapters = (bookPartDict, bookParts) => (Object.entries(bookPartDict)
  .reduce((acc, [part, chapters]) => {
    const [{ id: partId }] = bookParts.filter(({ partNum }) => partNum === parseInt(part));
    
    const partChapters = chapters.map((chapterName, index) => {
      const chapterNum = acc.length + index + 1;
      return {
        id: getNextId(),
        chapterName,
        partId,
        chapterNum,
      };
    });

    return [...acc, ...partChapters];
  }, [])
);

const bookParts = setBookParts(BOOK_PARTS);
const chapters = setChapters(BOOK_PART_DICT, bookParts);

const getData = async (chapterNum) => {
  const data = await axios.post(routes.getText(), { chapterNum });
  return data;
};

const getTests = async (userId) => {
  const data = await axios.post(routes.getTest(), { userId });
  return data;
}

export const fetchData = createAsyncThunk(
  'data/fetchData',
  async (chapterNum, thunkAPI) => {
    const response = await getData(chapterNum);
    return response.data;
  }
)

export const fetchTests = createAsyncThunk(
  'tests/fetchTests',
  async (userId, thunkAPI) => {
    const response = await getTests(userId);
    return response.data;
  }
)

const { id: firstChapterId, chapterName: firstChapterName } = chapters[0];

const initialState = {
  bookParts,
  chapters,
  currentChapterId: firstChapterId,
  currentChapterName: firstChapterName,
  currentText: null,
  tests: [],
  chapterTests: [],  
  userAnswers: [],   // [{ testId, answerIds: [] }, ...]
  currentTestIndex: null,
};

export const bookSlice = createSlice({
  name: 'bookSlice',
  initialState,
  reducers: {
    setCurrentChapter: (state, action) => {
      const newId = action.payload;
      state.currentChapterId = newId;
      const [{ chapterName }] = state.chapters.filter(({ id }) => id === newId);
      state.currentChapterName = chapterName;
    },
    setChapterTests: (state, action) => {
      state.chapterTests = action.payload;
    },
    setCurrentTestIndex: (state, action) => {
      state.currentTestIndex = action.payload;
    },
    addUserAnswer: (state, action) => {
      const userAnswer = action.payload;
      
      // state.userAnswers.map(({ testId, answerIds }) => ({
      //   testId,
      //   answerIds: testId !== userAnswer.testId ? answerIds : [...answerIds, ...userAnswer.answerIds],
      // }));

      if (state.userAnswers.some(({ testId }) => testId === userAnswer.testId)) {
        const answers = state.userAnswers.map(({ testId, answerIds }) => {
          if (testId === userAnswer.testId) {
            answerIds.push(userAnswer.answerIds[0]);
          }
        })

        state.userAnswers = answers;
      } else {
        state.userAnswers.push(action.payload);
      }
    },
    removeUserAnswer: (state, action) => {
      const userAnswer = action.payload;
      state.userAnswers = state.userAnswers.map(({ testId, answerIds }) => {
        const result = {
          testId,
          answerIds: testId === userAnswer.testId ? answerIds.filter((id) => id !== userAnswer.answerIds[0]) : answerIds,
        };
        console.log(result);
        return result;
      })
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      return {
        ...state,
        currentText: action.payload.file === '' ? '' : action.payload.file,
      }
    })
    builder.addCase(fetchTests.fulfilled, (state, action) => {
      if (action.payload.tests[0]?.chapterId === 0) {
        const tests = action.payload.tests.map((test) => {
          const { id } = state.chapters.find(({ chapterNum: num }) => {
            return (num === test.chapterNum);
          });

          return {
            ...test,
            chapterId: id,
          };
        });

        return {
          ...state,
          tests,
        };
      }

      return {
        ...state,
        tests: action.payload.tests,
      }
    })
  }
});

export const { 
  setCurrentChapter, 
  setChapterTests, 
  setCurrentTestIndex,
  addUserAnswer,
  removeUserAnswer,
} = bookSlice.actions;

export default bookSlice.reducer;
 