import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice.js';
import bookReducer from '../slices/bookSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,
    book: bookReducer,
  },
});
