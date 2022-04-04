import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPath: '/',
  isTesting: false,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload;
    },
    setIsTesting: (state) => {
      state.isTesting = !state.isTesting;
    }
  }
});

export const { setCurrentPath, setIsTesting } = userSlice.actions;

export default userSlice.reducer;
