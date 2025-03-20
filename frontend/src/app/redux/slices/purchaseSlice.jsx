import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  purchases: [],
  loading: false,
  error: null,
};

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    setPurchases: (state, action) => {
      state.purchases = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setPurchases, setLoading, setError } = purchasesSlice.actions;

// Thunk action to fetch all purchases
export const fetchPurchaseHistory = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await fetch('/api/purchases');
    if (!response.ok) {
      throw new Error('Failed to fetch purchase history');
    }
    const data = await response.json();
    dispatch(setPurchases(data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default purchasesSlice.reducer;