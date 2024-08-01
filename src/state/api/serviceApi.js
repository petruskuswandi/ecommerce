import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/services`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/show-services",
    }),
    getService: builder.query({
      query: (name) => `${name}`,
    }),
    giveReview: builder.mutation({
      query: ({ id, body }) => ({
        url: `/give-review/${id}`,
        method: "POST",
        body,
      }),
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          serviceApi.endpoints.getServices.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
    deleteServices: builder.mutation({
      query: (id) => ({
        url: `/delete-all`,
        method: "DELETE",
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          serviceApi.endpoints.getServices.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
    addService: builder.mutation({
      query: (body) => ({
        url: `/add-service`,
        method: "POST",
        body,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          serviceApi.endpoints.getServices.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
    editService: builder.mutation({
      query: ({ body, id }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          serviceApi.endpoints.getServices.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
    uploadServices: builder.mutation({
      query: (body) => ({
        url: "/upload-services",
        method: "POST",
        body,
      }),
      async onQueryStarted(queryArg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          serviceApi.endpoints.getServices.initiate(undefined, {
            forceRefetch: true,
          })
        );
      },
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useGiveReviewMutation,
  useDeleteServiceMutation,
  useDeleteServicesMutation,
  useAddServiceMutation,
  useUploadServicesMutation,
  useEditServiceMutation,
} = serviceApi;
