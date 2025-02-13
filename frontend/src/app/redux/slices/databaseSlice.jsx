import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'disconnected',
  error: null,
};

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    setConnectionStatus: (state, action) => {
      state.status = action.payload;
    },
    setConnectionError: (state, action) => {
      state.error = action.payload;
      state.status = 'error';
    },
  },
});

export const { setConnectionStatus, setConnectionError } =
  databaseSlice.actions;
export default databaseSlice.reducer;
