import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allUsers: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    addUser: (state, action) => {
      state.allUsers.push(action.payload);
    },
    updateUser: (state, action) => {
      state.allUsers = state.allUsers.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
    },
  },
});

export const { setUsers, addUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
