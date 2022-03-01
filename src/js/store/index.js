import { configureStore } from '@reduxjs/toolkit';
import pathReducer from '../slices/pathSlice.js';

export const store = configureStore({
  reducer: {
    pathReducer,
  },
});
