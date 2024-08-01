import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/cart`,
    credentials: "include",
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/my-cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ serviceId, qty }) => ({
        url: "/add-to-cart",
        method: "POST",
        body: { serviceId, qty },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (serviceId) => ({
        url: `/remove-service/${serviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ serviceId, qty }) => ({
        url: `/update-quantity/${serviceId}`,
        method: "PUT",
        body: { qty },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} = cartApi;