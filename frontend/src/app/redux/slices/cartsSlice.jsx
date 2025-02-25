import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCartId: null,
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
      debugger;
      state.activeCart.products = state.activeCart.products.filter(
        (item) => item.product._id !== action.payload._id
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
    setActiveCartId: (state, action) => {
      state.activeCartId = action.payload;
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
        (item) => item.product._id === productData._id
      );
      product.quantity = product.quantity + 1;
    },
    decrementCartItemQuantity: (state, action) => {
      //find product in active cart and only decrement the quantity by 1 here, not from  payload

      const { product: productData } = action.payload;
      const product = state.activeCart.products.find(
        (item) => item.product._id === productData._id
      );
      product.quantity = product.quantity - 1;
    },
  },
});

//function that gets all of the carts
export const getAllCarts = () => async (dispatch) => {
  try {
    const response = await fetch('/api/carts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('All Carts', data);
      dispatch(setAllCarts(data || []));
    } else {
      throw new Error('Failed to fetch Carts');
    }
  } catch (error) {
    console.log('Error fetching all carts', error.message);
  }
};

//function that returns true if the product is already in the active cart
export const isProductInActiveCart = (state, productId) => {
  if (state.activeCart.products.length === 0) {
    return false;
  }

  const product = state.activeCart.products.find(
    (item) => item.product._id === productId
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
  setActiveCartId,
} = cartsSlice.actions;
export default cartsSlice.reducer;
