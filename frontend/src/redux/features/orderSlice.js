import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  totalCount: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload.orders || [];
      state.totalCount = action.payload.totalCount || 0;
      state.loading = false;
      state.error = null;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearOrder: (state) => {
      state.order = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setOrders,
  setOrder,
  setLoading,
  setError,
  clearOrder,
  clearError,
} = orderSlice.actions;
export default orderSlice.reducer;
