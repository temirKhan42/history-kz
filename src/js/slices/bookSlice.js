import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import axios from 'axios';
import { BOOK_PARTS, BOOK_PART_DICT } from '../../data/index.js';

const getNextId = () => Number(_.uniqueId());

// const getParsingText = (text) => {
//   return text.split('</p>')
//     .map((paragraph) => <p>{paragraph.slice(3)}</p>)
// };

// const TEXT_DICT = {
//   'chapter_1': 'chapter1 text',
//   'chapter_2': 'chapter2 text',
//   'chapter_3': 'chapter3 text',
//   'chapter_4': 'chapter4 text',
// };

// const setTexts = (textDict, chapters) => (Object.entries(textDict)
//   .map(([chapter_i, text]) => {
//     const { id: chapterId } = chapters
//       .find(({ chapterNum }) => chapterNum === parseInt(chapter_i.split('_')[1]));

//     return {
//       chapterId,
//       text,
//     };
//   })
// );

// const texts = setTexts(TEXT_DICT, chapters);

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
  const data = await axios.post('/api/v1/text', { chapterNum });
  return data;
};

export const fetchData = createAsyncThunk(
  'data/fetchData',
  async (chapterNum, thunkAPI) => {
    const response = await getData(chapterNum);
    return response.data;
  }
)

const { id: firstChapterId, chapterName: firstChapterName } = chapters[0];

const initialState = {
  bookParts,
  chapters,
  currentChapterId: firstChapterId,
  currentChapterName: firstChapterName,
  currentText: '',
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      return {
        ...state,
        currentText: action.payload.file === '' ? null : action.payload.file,
      }
    })
  }
});

export const { setCurrentChapter } = bookSlice.actions;

export default bookSlice.reducer;
 