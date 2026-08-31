import { createSlice } from "@reduxjs/toolkit";

const getCartKey = (userId) => {
  return userId
    ? `cartItems_${userId}`
    : "cartItems_guest";
};

const initialState = {
  cartItems: [],
  userId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    
    setUserCart: (state, action) => {
      const userId = action.payload?.userId || null;

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

      if (!item || !item.productId) return;

      const existingItemIndex = state.cartItems.findIndex(
        (cartItem) =>
          cartItem.productId === item.productId
      );

      if (existingItemIndex !== -1) {
        state.cartItems[existingItemIndex] = item;
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem(
        getCartKey(state.userId),
        JSON.stringify(state.cartItems)
      );
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;

      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== productId
      );

      localStorage.setItem(
        getCartKey(state.userId),
        JSON.stringify(state.cartItems)
      );
    },

    clearCart: (state) => {
      state.cartItems = [];

      localStorage.removeItem(
        getCartKey(state.userId)
      );
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