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
        url: "http://localhost:8000/auth/signup",
        method: "post",
        body: data,
      }),
    }),
    otp: builder.mutation({
      query: (data) => ({
        url: "http://localhost:8000/auth/otp",
        method: "post",
        body: data,
      }),
    }),
    razporpay: builder.mutation({
      query: () => ({
        url: "http://localhost:8000/users/orders",
        method: "get",
      }),
    }),
    razporPaySuccess: builder.mutation({
      query: (data) => ({
        url: "http://localhost:8000/users/success",
        method: "post",
        body: data,
      }),
    }),
    facebookAccessToken: builder.mutation({
      query: () => ({
        url: "http://localhost:8000/users/fbtoken",
        method: "get",
      }),
    }),
    facebookGetComments: builder.mutation({
      query: () => ({
        url: "http://localhost:8000/users/fbcomments",
        method: "get",
      }),
    }),
    youtubeComments: builder.mutation({
      query: () => ({
        url: "http://localhost:8000/users/youtubecomments",
        method: "get",
      }),
    }),
    rtmpUrlFB: builder.mutation({
      query: () => ({
        url: "http://localhost:8000/users/rtmpFB",
        method: "get",
      }),
    }),
    rtmpUrlYoutube: builder.mutation({
      query: () => ({
        url: "http://localhost:8000/users/rtmpyoutube",
      }),
      method: "get",
    }),
    subscription: builder.mutation({
      query: () => ({
        url: "http://localhost:8000/users/subscription",
        method: "get",
      }),
    }),
    youtubeToken: builder.mutation({
      query: (data) => ({
        url: "http://localhost:8000/users/youtubeaccesstoken",
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

export const {
  useLoginMutation,
  useGoogleAuthMutation,
  useSignupMutation,
  useLogoutMutation,
  useOtpMutation,
  useRazporpayMutation,
  useRazporPaySuccessMutation,
  useFacebookAccessTokenMutation,
  useRtmpUrlFBMutation,
  useRtmpUrlYoutubeMutation,
  useSubscriptionMutation,
  useFacebookGetCommentsMutation,
  useYoutubeTokenMutation,
  useYoutubeCommentsMutation
} = userApiSlice;