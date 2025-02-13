import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import cartsReducer from './slices/cartsSlice';
import productsReducer from './slices/productsSlice';
import databaseReducer from './slices/databaseSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    carts: cartsReducer,
    products: productsReducer,
    database: databaseReducer,
  },
});

export default store;
