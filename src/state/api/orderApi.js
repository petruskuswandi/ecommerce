import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/order`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
    }),
    createOrderFromCart: builder.mutation({
      query: (body) => ({
        url: "/create-from-cart",
        method: "POST",
        body,
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: "/my-orders",
        method: "GET",
      }),
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `/${orderId}`,
        method: "GET",
      }),
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, orderStatus }) => ({
        url: `/${orderId}/status`,
        method: "PATCH",
        body: { orderStatus },
      }),
    }),
    updatePaymentStatus: builder.mutation({
      query: ({ orderId, paymentStatus }) => ({
        url: `/${orderId}/payment`,
        method: "PATCH",
        body: { paymentStatus },
      }),
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/${orderId}`,
        method: "DELETE",
      }),
    }),
    uploadBeforeWashingImages: builder.mutation({
      query: ({ orderId, serviceId, images }) => {
        const formData = new FormData();
        formData.append("serviceId", serviceId);
        images.forEach((image) => {
          formData.append("images", image);
        });
        return {
          url: `/${orderId}/before-washing`,
          method: "POST",
          body: formData,
        };
      },
    }),
    uploadAfterWashingImages: builder.mutation({
      query: ({ orderId, serviceId, images }) => {
        const formData = new FormData();
        formData.append("serviceId", serviceId);
        images.forEach((image) => {
          formData.append("images", image);
        });
        return {
          url: `/${orderId}/after-washing`,
          method: "POST",
          body: formData,
        };
      },
    }),
    updateDeliveryStatus: builder.mutation({
      query: ({ orderId, deliveryStatus }) => ({
        url: `/${orderId}/delivery`,
        method: "PATCH",
        body: { deliveryStatus },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useCreateOrderFromCartMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useDeleteOrderMutation,
  useUploadBeforeWashingImagesMutation,
  useUploadAfterWashingImagesMutation,
  useUpdateDeliveryStatusMutation,
} = orderApi;
