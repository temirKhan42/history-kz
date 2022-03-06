import { configureStore } from '@reduxjs/toolkit';
import pathReducer from '../slices/pathSlice.js';
import bookReducer from '../slices/bookSlice.js';

export const store = configureStore({
  reducer: {
    path: pathReducer,
    book: bookReducer,
  },
});
