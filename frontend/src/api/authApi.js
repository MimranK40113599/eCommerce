import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/register
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

    // POST /api/v1/login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      // Store token on successful login
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            localStorage.setItem("hzaluna_token", data.token);
            localStorage.setItem("hzaluna_user", JSON.stringify(data.user));
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),

    // POST /api/v1/logout
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("hzaluna_token");
          localStorage.removeItem("hzaluna_user");
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),

    // GET /api/v1/me
    getProfile: builder.query({
      query: () => "/me",
      providesTags: ["User"],
    }),

    // PUT /api/v1/me/update
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: "/me/update",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // PUT /api/v1/password/update
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/password/update",
        method: "PUT",
        body: passwordData,
      }),
    }),

    // POST /api/v1/password/forgot
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/password/forgot",
        method: "POST",
        body: email,
      }),
    }),

    // PUT /api/v1/password/reset/:token
    resetPassword: builder.mutation({
      query: ({ token, passwordData }) => ({
        url: `/password/reset/${token}`,
        method: "PUT",
        body: passwordData,
      }),
    }),

    // PUT /api/v1/me/upload_avatar
    uploadAvatar: builder.mutation({
      query: (avatarData) => ({
        url: "/me/upload_avatar",
        method: "PUT",
        body: avatarData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUploadAvatarMutation,
} = authApi;
