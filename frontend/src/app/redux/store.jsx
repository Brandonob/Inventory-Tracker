import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/usersSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productsSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    product: productReducer,
  },
});

export default store;
