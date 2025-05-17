import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

// const USER_API = "http://localhost:9999/api/user/";
const USER_API = "https://hd-learning.onrender.com/api/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // mutation used to post data in api and use quey for get data
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          // get res from backend
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loadUser: builder.query({
      // query for get request
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          // get res from backend
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      }
    }),
    updateUser: builder.mutation({
      query: (inputData) => ({
        url: "profile/update",
        method: "PUT",
        body: inputData,
        credentials: 'include'
      }),
    }),
    logoutUser : builder.mutation({
        query : () => ({
            url: "logout",
            method: "GET",
        }),
        async onQueryStarted(_, {queryFulfilled, dispatch }) {
            try {
              // get res from backend
              dispatch(userLoggedOut());
            } catch (error) {
              console.log(error);
            }
          }
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useLogoutUserMutation
} = authApi;
