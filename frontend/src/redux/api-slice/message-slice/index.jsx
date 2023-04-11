import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const MessageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
  }),
  tagTypes: ["Messages"],
  endpoints: (build) => ({
    getFriendMessage: build.query({
      query: ({ userToken }) => ({
        url: "/chat/getFriend",
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        credentials: "include",
      }),
      providesTags: ["Messages"],
    }),
    getChatByRoomId: build.query({
      query: ({ userToken, chatId }) => ({
        url: `/chat/${chatId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        credentials: "include",
      }),
      providesTags: ["Messages"],
    }),
    getRoomById: build.query({
      query: ({ userToken, roomId }) => ({
        url: `/chatroom/${roomId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        credentials: "include",
      }),
      providesTags: ["Messages"],
    }),
    postMessage: build.mutation({
      query: ({ userToken, chatId, userId, message }) => ({
        url: "/chat",
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: {
          chatId,
          userId,
          message,
        },
        credentials: "include",
      }),
      // invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useGetFriendMessageQuery,
  useGetChatByRoomIdQuery,
  useGetRoomByIdQuery,
  usePostMessageMutation,
} = MessageApi;
