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
    getUser: build.query({
      query: ({ userToken }) => ({
        url: `/users?q=all`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }),
      providesTags: ["Users"],
    }),
    searchUser: build.query({
      query: ({ userToken, userString }) => ({
        url: `/users?search=${userString}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUserQuery, useSearchUserQuery } = UserApi;
