import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const BOOK_PART_DICT = {
  part1: ['Глава 1. Казахстан в эпоху камня', 'Глава 2. Казахстан в эпоху бронзы' , 'Глава 3. Кочевое скотоводство - производящее хозяйство', 'Глава 4. Саки', 'Глава 5. Сакская археологическая культура и сарматы', 'Глава 6. Ранние государства на территории Казахстана', 'Уйсуны', 'Кангюи', 'Гунны'],
  part2: ['Глава 1. Раннесредневековые государства (VI-XII вв.)', 'Тюркский каганат', 'Западнотюркский каганат', 'Восточнотюркский каганат', 'Тюргешский каганат', 'Карлукский каганат', 'Огузское государство', 'Кимакский каганат', 'Глава 2. Оседлая и полукочевая культура в VI-IX веках', 'Глава 3. Великий Шелковый путь', 'Глава 4. Государства в период расцвета средневековья (X-XIII вв.)', 'Государство Караханидов', 'Найманы', 'Жалаиры', 'Кереи (кереиты)', 'Каракитаи', 'Кыпчакское ханство', 'Глава 5. Культура Казахстана во второй половине IX - начале XIII веков', 'Глава 6. Монгольские завоевания. Золотая орда. Белая орда', 'Завоевание монголами территорий Казахстана', 'Золотая орда', 'Белая орда', 'Глава 7. Казахстан в XIII - первой половине XV вв', 'Могулистан', 'Государство - административное устройство', 'Глава 8. Экономическое и культурное положение Казахстана в XIV-XV вв', 'Глава 9. Сложение казахской народности', 'Глава 10. Образование единого Казахского ханства', 'Глава 11. Укрепление казахского ханства в XVI-XVII веках'],
};

const BOOK_PARTS = ['Часть I. История древнего Казахстана', 'Часть II. История средневекового Казахстана'];

const FIRST_CHAPTER_NAME = BOOK_PART_DICT.part1[0];

const setBookParts = (bookParts) => (bookParts.map((partName, index) => ({
  id: _.uniqueId(),
  partName,
  partNum: `part${index + 1}`,
})));

const setChapters = (bookPartDict, bookParts) => (Object.entries(bookPartDict)
  .reduce((acc, [part, chapters], ) => {
    const [{ id: partId }] = bookParts.filter(({ partNum }) => partNum === part);

    const partChapters = chapters.map((chapterName) => ({
      id: _.uniqueId(),
      chapterName,
      partId,
    }));

    return [...acc, ...partChapters];
  }, [])
);

const bookParts = setBookParts(BOOK_PARTS);
const chapters = setChapters(BOOK_PART_DICT, bookParts);
const [{ id: firstChapterId }] = chapters.filter(({ chapterName }) => chapterName === FIRST_CHAPTER_NAME);

const initialState = {
  summary: {
    bookParts,
    chapters,
    currentChapterId: firstChapterId,
    currentChapterName: FIRST_CHAPTER_NAME,
  },
};

export const bookSlice = createSlice({
  name: 'bookSlice',
  initialState,
  reducers: {
    setCurrentChapter: (state, action) => {
      const newId = action.payload;
      state.summary.currentChapterId = newId;
      const [{ chapterName }] = state.summary.chapters.filter(({ id }) => id === newId);
      state.summary.currentChapterName = chapterName;
    },
  }
});

export const { setCurrentChapter } = bookSlice.actions;

export default bookSlice.reducer;
 