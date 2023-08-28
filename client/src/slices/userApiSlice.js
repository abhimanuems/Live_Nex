import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "auth/login",
        method: "post",
        body: data,
      }),
    }),
    googleAuth: builder.mutation({
      query: () => ({
        url: "auth/google",
        method: "get",
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "auth/signup",
        method: "post",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "get",
      }),
    }),
  }),
});

export const { useLoginMutation,useGoogleAuthMutation,useSignupMutation, useLogoutMutation} =userApiSlice