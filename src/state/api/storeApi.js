import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/store`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getStoreData: builder.query({
      query: () => "/get-data",
    }),
    updateStore: builder.mutation({
      query: (body) => ({
        url: "/update-store",
        method: "PUT",
        body,
      }),
    }),
    deleteSlider: builder.mutation({
      query: (sliderId) => ({
        url: `/delete-slider/${sliderId}`,
        method: "DELETE",
      }),
    }),
    updateSlider: builder.mutation({
      query: ({ sliderId, body }) => ({
        url: `/update-slider/${sliderId}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetStoreDataQuery,
  useUpdateStoreMutation,
  useDeleteSliderMutation,
  useUpdateSliderMutation,
} = storeApi;
