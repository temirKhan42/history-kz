import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPath: '',
};

export const pathSlice = createSlice({
  name: 'pathSlice',
  initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload;
    }
  }
});

export const { setCurrentPath } = pathSlice.actions;

export default pathSlice.reducer;
