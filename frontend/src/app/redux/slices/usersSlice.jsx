import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
    },
  },
});

export const { setUser, addUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
