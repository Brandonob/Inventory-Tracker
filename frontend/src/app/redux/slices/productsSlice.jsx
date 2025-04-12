import { createSlice } from '@reduxjs/toolkit';
// import { getAllProducts } from '../../utils/dbHelpers';

const initialState = {
  allProducts: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.allProducts = action.payload;
      state.loading = false;
      state.error = null;
    },
    addProduct: (state, action) => {
      state.allProducts.push(action.payload);
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const fetchAllProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading());

    const response = await fetch('/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('All Products:', data.products);

      dispatch(setProducts(data.products || []));
    } else {
      throw new Error('Failed to fetch products');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    dispatch(setError(error.message));
  }
};

export const { setProducts, addProduct, updateProduct, setLoading, setError } =
  productsSlice.actions;
export default productsSlice.reducer;
