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
export const fetchAllPurchases = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await fetch('/api/purchases', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch purchase history');
    }

    const data = await response.json();
    dispatch(setPurchases(data.purchases || []));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default purchasesSlice.reducer;