import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = [];
    },  
  },
});

export const { setUser, clearUser } = usersSlice.actions;
export default usersSlice.reducer;
