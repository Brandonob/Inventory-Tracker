import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allCarts: [],
  activeCart: {
    products: [],
    // [{ product: { id: 1, name: 'test', price: 100 }, quantity: 1 }],
  },
};
//activeCart is an object with a products array of objects with a product and quantity
//update actions to match this structure
const cartsSlice = createSlice({
  name: 'carts',
  initialState,
  reducers: {
    addCart: (state, action) => {
      state.allCarts.push(action.payload);
    },
    setAllCarts: (state, action) => {
      state.allCarts = action.payload;
    },
    removeProductFromActiveCart: (state, action) => {
      state.activeCart.products = state.activeCart.products.filter(
        (item) => item.product.id !== action.payload
      );
    },
    //add product object to products array in active cart
    addProductToActiveCart: (state, action) => {
      state.activeCart = {
        ...state.activeCart,
        products: [
          ...state.activeCart.products,
          {
            product: action.payload.product,
            quantity: action.payload.quantity,
          },
        ],
      };
    },
    setActiveCart: (state, action) => {
      state.activeCart.products = [action.payload];
    },
    removeCart: (state, action) => {
      state.allCarts = state.allCarts.filter(
        (item) => item.id !== action.payload
      );
    },
    incrementCartItemQuantity: (state, action) => {
      //find product in active cart products array and increment the quantity by 1
      const { product: productData } = action.payload;
      const product = state.activeCart.products.find(
        (product) => product.product.id === productData.id
      );
      product.quantity = product.quantity + 1;
    },
    decrementCartItemQuantity: (state, action) => {
      //find product in active cart and only decrement the quantity by 1 here, not from  payload

      const { product: productData } = action.payload;
      const product = state.activeCart.products.find(
        (product) => product.product.id === productData.id
      );
      product.quantity = product.quantity - 1;
    },
  },
});

//function that returns true if the product is already in the active cart
export const isProductInActiveCart = (state, productId) => {
  if (state.activeCart === undefined) {
    return false;
  }
  const product = state.activeCart.products.find(
    (product) => product.product.id === productId
  );
  return product ? true : false;
};

export const {
  addCart,
  addProductToActiveCart,
  removeProductFromActiveCart,
  removeCart,
  setActiveCart,
  setAllCarts,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
} = cartsSlice.actions;
export default cartsSlice.reducer;
