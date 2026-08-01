/* import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/admin/users (ADMIN)
    getAdminUsers: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/admin/users${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["User"],
    }),

    // GET /api/v1/admin/users/:id (ADMIN)
    getUserDetails: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // PUT /api/v1/admin/users/:id (ADMIN)
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // DELETE /api/v1/admin/users/:id (ADMIN)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
 */

import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/admin/users${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["User"],
    }),

    getUserDetails: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
