import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allCarts: [],
};

const cartsSlice = createSlice({
  name: 'carts',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addToCart, removeFromCart } = cartsSlice.actions;
export default cartsSlice.reducer;
