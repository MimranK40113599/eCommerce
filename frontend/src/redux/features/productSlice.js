import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  totalCount: 0,
  filteredCount: 0,
  reviews: [],
  canReview: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.products || [];
      state.totalCount = action.payload.totalCount || 0;
      state.filteredCount = action.payload.filteredCount || 0;
      state.loading = false;
      state.error = null;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
      state.loading = false;
      state.error = null;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    setCanReview: (state, action) => {
      state.canReview = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearProduct: (state) => {
      state.product = null;
      state.reviews = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setProducts,
  setProduct,
  setReviews,
  setCanReview,
  setLoading,
  setError,
  clearProduct,
  clearError,
} = productSlice.actions;
export default productSlice.reducer;
