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

export const checkDatabaseConnection = () => async (dispatch) => {
  try {
    dispatch(setConnectionStatus('connecting'));
    const response = await fetch('/api/db-status');
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Connection failed');
    console.log('>>>>>>>CONNECTED TO DB<<<<<<<<');
    dispatch(setConnectionStatus('connected'));
  } catch (error) {
    dispatch(setConnectionError(error.message));
  }
};

// export const setToConnecting = () => async (dispatch) => {
//   dispatch(setConnectionStatus('connecting'));
// };

// export const setToConnected = () => async (dispatch) => {
//   dispatch(setConnectionStatus('connected'));
// };

// export const setToDisconnected = () => async (dispatch) => {
//   dispatch(setConnectionStatus('disconnected'));
// };

// export const setError = (error) => async (dispatch) => {
//   dispatch(setConnectionError(error));
// };

export const { setConnectionStatus, setConnectionError } =
  databaseSlice.actions;
export default databaseSlice.reducer;
