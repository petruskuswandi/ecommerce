import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shipmentApi = createApi({
  reducerPath: "shipmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/shipping`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: () => "/provinces",
    }),
    getCities: builder.query({
      query: (province_id) => `/city/${province_id}`,
    }),
    getServices: builder.query({
      query: ({ origin, destination, weight, courier }) =>
        `/cost/${origin}/${destination}/${weight}/${courier}`,
    }),
  }),
});

export const { useGetProvincesQuery, useGetCitiesQuery, useGetServicesQuery } =
  shipmentApi;
