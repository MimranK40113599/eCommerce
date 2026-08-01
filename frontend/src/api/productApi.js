import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/products
    getProducts: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/products${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Product"],
    }),

    // GET /api/v1/products/:id
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // POST /api/v1/admin/products (ADMIN)
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/admin/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    // PUT /api/v1/admin/products/:id (ADMIN)
    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    // DELETE /api/v1/admin/products/:id (ADMIN)
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // PUT /api/v1/admin/products/:id/upload_images (ADMIN)
    uploadProductImages: builder.mutation({
      query: ({ id, images }) => ({
        url: `/admin/products/${id}/upload_images`,
        method: "PUT",
        body: { images },
      }),
      invalidatesTags: ["Product"],
    }),

    // PUT /api/v1/admin/products/:id/delete_image (ADMIN)
    deleteProductImage: builder.mutation({
      query: ({ id, imgId }) => ({
        url: `/admin/products/${id}/delete_image`,
        method: "PUT",
        body: { imgId },
      }),
      invalidatesTags: ["Product"],
    }),

    // PUT /api/v1/reviews
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "/reviews",
        method: "PUT",
        body: reviewData,
      }),
      invalidatesTags: ["Review", "Product"],
    }),

    // GET /api/v1/reviews
    getReviews: builder.query({
      query: (productId) => `/reviews?productId=${productId}`,
      providesTags: ["Review"],
    }),

    // GET /api/v1/reviews/can_review
    canReview: builder.query({
      query: (productId) => `/reviews/can_review?productId=${productId}`,
    }),

    // DELETE /api/v1/admin/reviews (ADMIN)
    deleteReview: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `/admin/reviews?productId=${productId}&id=${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review", "Product"],
    }),

    // GET /api/v1/admin/products (ADMIN)
    getAdminProducts: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/admin/products${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useCreateReviewMutation,
  useGetReviewsQuery,
  useCanReviewQuery,
  useDeleteReviewMutation,
  useGetAdminProductsQuery,
} = productApi;
