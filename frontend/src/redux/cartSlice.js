import { createSlice } from "@reduxjs/toolkit";

const getCartKey = (userId) => `cartItems_${userId}`;

const initialState = {
  cartItems: [],
  userId: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    setUserCart: (state, action) => {
      const { userId } = action.payload;

      state.userId = userId;

      const savedCart = localStorage.getItem(
        getCartKey(userId)
      );

      state.cartItems = savedCart
        ? JSON.parse(savedCart)
        : [];
    },

    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.productId === item.productId
            ? item
            : x
        );
      } else {
        state.cartItems.push(item);
      }

      if (state.userId) {
        localStorage.setItem(
          getCartKey(state.userId),
          JSON.stringify(state.cartItems)
        );
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.productId !== action.payload
      );

      if (state.userId) {
        localStorage.setItem(
          getCartKey(state.userId),
          JSON.stringify(state.cartItems)
        );
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.userId = null;
    },
  },
});

export const {
  setUserCart,
  addToCart,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;