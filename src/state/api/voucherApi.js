import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const voucherApi = createApi({
  reducerPath: 'voucherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/voucher`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    createVoucher: builder.mutation({
      query: (voucherData) => ({
        url: '/create',
        method: 'POST',
        body: voucherData,
      }),
    }),
    getAllVouchers: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
    }),
    getVoucherByCode: builder.query({
      query: (code) => ({
        url: `/${code}`,
        method: 'GET',
      }),
    }),
    updateVoucher: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: updateData,
      }),
    }),
    deleteVoucher: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
    validateVoucher: builder.mutation({
      query: (validationData) => ({
        url: '/validate',
        method: 'POST',
        body: validationData,
      }),
    }),
  }),
});

export const {
  useCreateVoucherMutation,
  useGetAllVouchersQuery,
  useGetVoucherByCodeQuery,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
  useValidateVoucherMutation,
} = voucherApi;