/* import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/orders/new
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders/new",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),

    // GET /api/v1/me/orders
    getMyOrders: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/me/orders${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Order"],
    }),

    // GET /api/v1/orders/:id
    getOrderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // GET /api/v1/admin/orders (ADMIN)
    getAdminOrders: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/admin/orders${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Order"],
    }),

    // PUT /api/v1/admin/orders/:id (ADMIN)
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),

    // DELETE /api/v1/admin/orders/:id (ADMIN)
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),

    // GET /api/v1/admin/sales/statistics (ADMIN)
    getSalesStats: builder.query({
      query: ({ startDate, endDate }) =>
        `/admin/sales/statistics?startDate=${startDate}&endDate=${endDate}`,
    }),

    // POST /api/v1/payment/checkout_session
    createCheckoutSession: builder.mutation({
      query: (sessionData) => ({
        url: "/payment/checkout_session",
        method: "POST",
        body: sessionData,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetSalesStatsQuery,
  useCreateCheckoutSessionMutation,
} = orderApi;
 */

/* 



*/

import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders/new",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),

    getMyOrders: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/me/orders${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Order"],
    }),

    getOrderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    getAdminOrders: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/admin/orders${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Order"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),

    getSalesStats: builder.query({
      query: ({ startDate, endDate }) =>
        `/admin/sales/statistics?startDate=${startDate}&endDate=${endDate}`,
    }),

    createCheckoutSession: builder.mutation({
      query: (sessionData) => ({
        url: "/payment/checkout_session",
        method: "POST",
        body: sessionData,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetSalesStatsQuery,
  useCreateCheckoutSessionMutation,
} = orderApi;
