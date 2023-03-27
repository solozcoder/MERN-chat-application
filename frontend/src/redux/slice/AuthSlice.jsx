// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const userAuthApi = () =>
//   createApi({
//     reducerPath: "userAuthApi",
//     baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
//     endpoints: (builder) => ({
//       login: builder.mutation({
//         query: (user) => ({
//           url: "/login",
//           method: "POST",
//           body: user,
//         }),
//       }),
//       register: builder.mutation({
//         query: (user) => ({
//           url: "/register",
//           method: "POST",
//           body: user,
//         }),
//       }),
//     }),
//   });

// export const { useLoginMutation, useRegisterMutation } = userAuthApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersAuthApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
  }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (user) => "/users",
    }),
    postLogin: builder.mutation({
      query: (user) => ({
        url: "/login",
        method: "POST",
        body: user,
      }),
    }),
    postRegister: builder.mutation({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  usePostLoginMutation,
  usePostRegisterMutation,
} = usersAuthApi;
