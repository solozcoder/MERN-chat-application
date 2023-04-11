import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

var userToken = localStorage.getItem("userAuth");
userToken = userToken ? JSON.parse(userToken) : "";
export const UserApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
  }),
  tagTypes: ["Users"],
  endpoints: (build) => ({
    getUser: build.mutation({
      query: ({ userToken }) => ({
        url: `/users?q=all`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }),
      providesTags: ["Users"],
    }),
    searchUser: build.mutation({
      query: ({ userToken, userString }) => ({
        url: `/users?search=${userString}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUserMutation, useSearchUserMutation } = UserApi;
