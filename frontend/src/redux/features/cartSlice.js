import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem("hzaluna_cart");
    return cart
      ? JSON.parse(cart)
      : { cartItems: [], shippingInfo: {}, totalPrice: 0 };
  } catch {
    return { cartItems: [], shippingInfo: {}, totalPrice: 0 };
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (i) => i.product === item.product,
      );

      if (existingItem) {
        existingItem.quantity = item.quantity;
      } else {
        state.cartItems.push(item);
      }

      // Save to localStorage
      localStorage.setItem("hzaluna_cart", JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload,
      );
      localStorage.setItem("hzaluna_cart", JSON.stringify(state));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.shippingInfo = {};
      state.totalPrice = 0;
      localStorage.removeItem("hzaluna_cart");
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.product === productId);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem("hzaluna_cart", JSON.stringify(state));
    },
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("hzaluna_cart", JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  setShippingInfo,
} = cartSlice.actions;
export default cartSlice.reducer;
