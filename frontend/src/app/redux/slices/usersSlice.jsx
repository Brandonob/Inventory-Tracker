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
  },
});

export const { setUser } = usersSlice.actions;
export default usersSlice.reducer;
