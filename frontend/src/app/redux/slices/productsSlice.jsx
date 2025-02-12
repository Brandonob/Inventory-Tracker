import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      state.products = state.products.map((product) =>
        product._id === action.payload._id ? action.payload : product
      );
    },
  },
});

export const { setProducts, addProduct, updateProduct } = productsSlice.actions;
export default productsSlice.reducer;
