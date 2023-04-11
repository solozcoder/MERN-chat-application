import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const MessageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
  }),
  tagTypes: ["Messages"],
  endpoints: (build) => ({
    getMessage: build.query({
      query: ({ userToken }) => ({
        url: "/chat",
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        credentials: "include",
      }),
      providesTags: ["Messages"],
    }),
    getChatById: build.mutation({
      query: ({ userToken, userId }) => ({
        url: `/chat/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        credentials: "include",
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const { useGetMessageQuery, useGetChatByIdMutation } = MessageApi;
