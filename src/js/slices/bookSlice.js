import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import axios from 'axios';
import routes from '../routes/index.js';


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
    const { data } = await getTests(userId);
    return data;
  }
)

const initialState = {
  bookParts: [],
  chapters: [],
  isCurrentAnswerChecked: false,
  currentChapterId: null,
  currentChapterName: null,
  currentTestState: null,
  currentText: null,
  tests: [],
  chapterTests: [],  
  userAnswers: [],   // [{ testId, answerIds: [] }, ...]
  currentTestIndex: null,
  testsResults: [],
  allTestsResults: [],
};

export const bookSlice = createSlice({
  name: 'bookSlice',
  initialState,
  reducers: {
    setBookParts: (state, action) => {
      state.bookParts = action.payload;
    },
    setBookChapters: (state, action) => {
      state.chapters = action.payload;
    },
    setCurrentAnswerChecked: (state, action) => {
      state.isCurrentAnswerChecked = action.payload;
    },
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
    setTestsResults: (state, action) => {
      state.testsResults = action.payload;
    },
    setAllTestsResults: (state, action) => {
      state.allTestsResults = action.payload;
    },
    setCurrentTestState: (state, action) => {
      state.currentTestState = action.payload;
    },
    addUserAnswer: (state, action) => {
      const userAnswer = action.payload;

      if (state.userAnswers.some(({ testId }) => `${testId}` === `${userAnswer.testId}`)) {
        const answers = state.userAnswers.map(({ testId, answerIds }) => {
          const newAnswerIds = `${testId}` === `${userAnswer.testId}` ? [...answerIds, userAnswer.answerIds[0]] : answerIds;

          state.isCurrentAnswerChecked = newAnswerIds.length > 0;
          return {
            testId,
            answerIds: newAnswerIds,
          }
        });

        state.userAnswers = answers;
      } else {
        state.isCurrentAnswerChecked = userAnswer.answerIds.length > 0;
        state.userAnswers = [...state.userAnswers, userAnswer];
      }
    },
    removeUserAnswer: (state, action) => {
      const userAnswer = action.payload;
      state.userAnswers = state.userAnswers.map(({ testId, answerIds }) => {
        const newAnswerIds = `${testId}` === `${userAnswer.testId}` ? answerIds.filter((id) => `${id}` !== `${userAnswer.answerIds[0]}`) : answerIds;
        
        state.isCurrentAnswerChecked = newAnswerIds.length > 0;
        return {
          testId,
          answerIds: newAnswerIds,
        };
      })
    },
    resetUserAnswers: (state) => {
      state.userAnswers = [];
    },
    refreshTest: (state, action) => {
      console.log(action.payload);
      state.tests = action.payload;
    },
    refreshState: (state) => {
      state.bookParts = [];
      state.chapters = [];
      state.currentChapterId = null;
      state.currentChapterName = null;
      state.currentText = null;
      state.tests = [];
      state.chapterTests = [];  
      state.userAnswers = [];
      state.currentTestIndex = null;
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
      console.log(action.payload);
      state.tests = action.payload.tests;
    })
  }
});

export const {
  setBookParts,
  setBookChapters,
  setCurrentAnswerChecked,
  setCurrentChapter, 
  setChapterTests, 
  setCurrentTestState,
  setCurrentTestIndex,
  setTestsResults,
  setAllTestsResults,
  addUserAnswer,
  removeUserAnswer,
  resetUserAnswers,
  refreshState,
  refreshTest,
} = bookSlice.actions;

export default bookSlice.reducer;
 