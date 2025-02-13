import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allProducts: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.allProducts = action.payload;
    },
    addProduct: (state, action) => {
      state.allProducts.push(action.payload);
    },
    updateProduct: (state, action) => {
      state.allProducts = state.allProducts.map((product) =>
        product._id === action.payload._id ? action.payload : product
      );
    },
  },
});

export const fetchProducts = () => async (dispatch) => {
  try {
    const products = await getAllProducts();
    products ? dispatch(setProducts(products)) : dispatch(setProducts([]));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export const { setProducts, addProduct, updateProduct } = productsSlice.actions;
export default productsSlice.reducer;
