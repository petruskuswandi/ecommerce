import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import { serviceApi } from "./api/serviceApi";
import { shipmentApi } from "./api/shipmentApi";
import { paymentApi } from "./api/paymentApi";
import { orderApi } from "./api/orderApi";
import { cartApi } from "./api/cartApi";
import { userApi } from "./api/userApi";
import { voucherApi } from "./api/voucherApi";
import { storeApi } from "./api/storeApi";
import { notificationApi } from "./api/notificationApi";

const store = configureStore({
  reducer: {
    auth: authSlice,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [voucherApi.reducerPath]: voucherApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
    [shipmentApi.reducerPath]: shipmentApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      serviceApi.middleware,
      paymentApi.middleware,
      orderApi.middleware,
      userApi.middleware,
      cartApi.middleware,
      voucherApi.middleware,
      storeApi.middleware,
      shipmentApi.middleware,
      notificationApi.middleware,
    ]),
});

export default store;
