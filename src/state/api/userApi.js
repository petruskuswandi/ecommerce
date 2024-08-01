import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/user`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/get",
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: "/update-profile",
        method: "PUT",
        body: userData,
      }),
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/change-password",
        method: "PUT",
        body: passwordData,
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/delete/${userId}`,
        method: "DELETE",
      }),
    }),
    sendResetPasswordEmail: builder.mutation({
      query: (email) => ({
        url: "/send-email",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, passwordData }) => ({
        url: `/reset-password/${token}`,
        method: "PUT",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useDeleteUserMutation,
  useSendResetPasswordEmailMutation,
  useResetPasswordMutation
} = userApi;
